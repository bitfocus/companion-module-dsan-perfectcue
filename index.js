var tcp           = require('../../tcp');
var instance_skel = require('../../instance_skel');
var actions       = require('./actions');
var feedback      = require('./feedback');
var presets       = require('./presets');

var debug;
var log;
var lineEndings;

class instance extends instance_skel {
	/**
	* Create an instance.
	*
	* @param {EventEmitter} system - the brains of the operation
	* @param {string} id - the instance ID
	* @param {Object} config - saved user configuration parameters
	* @since 1.1.0
	*/
	constructor(system, id, config) {
		super(system, id, config);

		Object.assign(this, {...actions,...feedback,...presets});

		this.lineEndings = '\r';
		this.feedbackstate = {};
		this.actions(); // export actions

	}
	/**
	 * Setup the actions.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @access public
	 * @since 1.1.0
	 */
	actions(system) {
		this.setActions(this.getActions());
	}
	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.1.0
	 */
	config_fields() {

		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module controls Dsan PerfectCue by <a href="http://dsan.com" target="_new">Dsan</a>. Via the GlobalCache TP2SL and the Dsan TP-2000X'
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: this.REGEX_IP
			},
			{	type: 'textinput',
				id:   'port',
				label:'Target port',
				width: 6,
				default: 4999
			},
			{
				type: 'text',
				id: 'info',
				width: 6,
				label: 'Feedback',
				value: 'This module has support for getting information about the timer back to companion.'
			}
		]
	}
	/**
	 * Executes the provided action.
	 *
	 * @param {Object} action - the action to be executed
	 * @access public
	 * @since 1.0.0
	 */
	action(action) {
		var id = action.action;
		var cmd;
		var opt = action.options;

		switch (id){

			case 'fwd':
				cmd = '>FORWARD 35';
				break;

			case 'rev':
				cmd = '>REVERSE 3C';
				break;

			case 'boOn':
				cmd = '>BLANKON 25';
				break;
				
			case 'boOff':
				cmd= '>BLANKOF 1D';
				break;
				
		}

		if (cmd !== undefined) {
			debug('sending ', cmd, "to", this.config.host);
			if (this.currentStatus != this.STATUS_OK) {
				this.init_tcp(() => {
					this.socket.send(cmd + this.lineEndings);
					console.log("sending"+ cmd + this.lineEndings + this.config.host + ":" + this.config.port);
				});
			} else {
				this.socket.send(cmd + this.lineEndings);
				console.log("sending"+ cmd + this.lineEndings + this.config.host + ":" + this.config.port);
			}
		}
	}
	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.1.0
	 */
	destroy() {

		if (this.timer) {
			clearInterval(this.timer);
			delete this.timer;
		}

		if (this.socket !== undefined) {
			this.socket.destroy();
		}
		debug("destroy", this.id);
	}
	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.1.0
	 */
	init() {
		debug = this.debug;
		log = this.log;

		this.initPresets();
		this.init_tcp();
		this.initVariables();
		this.initFeedbacks();
	}
	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	init_tcp() {
		if (this.socket !== undefined) {
			this.socket.destroy();
			delete this.socket;
		}

		if (this.config.host) {
			this.socket = new tcp(this.config.host, this.config.port, { reconnect: false });

			this.socket.on('status_change', (status, message) => {
				this.status(status, message);
			});

			this.socket.on('error', (err) => {
				this.debug("Network error", err);
				this.log('error',"Network error: " + err.message);
			});
		
			this.socket.on('connect', () => {
				this.debug("Connected");	
				this.socket.receivebuffer = '';
			});

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				var i = 0, line = '', offset = 0;

				this.socket.receivebuffer += chunk;
				console.log("incomming" + chunk)

				while ( (i = this.socket.receivebuffer.indexOf('\r', offset)) !== -1) {
					line = this.socket.receivebuffer.substr(offset, i - offset);
					offset = i + 2;
					this.socket.emit('receiveline', line.toString());
				}
				this.socket.receivebuffer = this.socket.receivebuffer.substr(offset);
			});

			this.socket.on('receiveline', (data) => {

				var info = data.toString().split(/[= ]+/);
				if (info[0].substr(0,1) === '>') {
					info[0] = info[0].substr(1,info[0].length);
				}
				// console.log('INFO ',info)
				
				if (info.length == 2) {

					if (info[0] == 'FRWLEDON') {
						this.feedbackstate.fwd = 'on';
						this.updateFwd();
						this.checkFeedbacks('fwd');
					}

					if (info[0] == 'FRWLEDOF') {
						this.feedbackstate.fwd = 'off';
						this.updateFwd();
						this.checkFeedbacks('fwd');
					}

					if (info[0] == 'RVSLEDON') {
						this.feedbackstate.rev = 'on';
						this.updateRev();
						this.checkFeedbacks('rev');
					}
						
					if (info[0] == 'RVSLEDOF') {
						this.feedbackstate.rev = 'off';
						this.updateRev();
						this.checkFeedbacks('rev');
					}

					if (info[0] == 'BLKLEDON') {
						this.feedbackstate.blank = 'on';
						this.updateBlank();
						this.checkFeedbacks('blank');
					}

					if (info[0] == 'BLKLEDOF') {
						this.feedbackstate.blank = 'off';
						this.updateBlank();
						this.checkFeedbacks('blank');					
					}


					
				}
				
			});

			this.socket.on('end', () => {
				debug('Disconnected, ok');
				this.socket.destroy();
				delete this.socket;
			});
		}
	}
	
	/**
	 * INTERNAL: initialize feedbacks.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	
	
	 initFeedbacks() {
		// feedbacks
		var feedbacks = this.getFeedbacks();

		this.setFeedbackDefinitions(feedbacks);
	}
	
	/**
	 * INTERNAL: initialize presets.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	initPresets (updates) {
		var presets = this.getPresets(updates);

		this.setPresetDefinitions(presets);
	}
	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.1.0
	 */
	updateConfig (config) {
		var resetConnection = false;

		if (this.config.host != config.host)
		{
			resetConnection = true;
		}

		this.config = config;
		this.initPresets();
		this.initVariables();
		this.initFeedbacks();
		if (resetConnection === true || this.socket === undefined) {
			this.init_tcp();
		}
	}
	/**
	 * INTERNAL: initialize variables.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	initVariables() {

		var variables = [
			{
				label: 'State of FWD LED',
				name: 'var_fwd'
			},
			{
				label: 'State of Rev LED',
				name: 'var_rev'
			},
			{
				label: 'State of Blank LED',
				name: 'var_blank'
			},
		
		];

		this.setVariableDefinitions(variables);
	}

	
	updateFwd() {	
		this.setVariable('var_fwd', this.feedbackstate.fwd);
	}

	updateRev() {	
		this.setVariable('var_rev', this.feedbackstate.rev);
	}

	updateBlank() {	
		this.setVariable('var_blank', this.feedbackstate.blank);
	}

}

exports = module.exports = instance;
