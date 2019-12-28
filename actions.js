module.exports = {

	/**
	* Get the available actions.
	*
	* @returns {Object[]} the available actions
	* @access public
	* @since 1.1.0
	*/

	getActions() {
		var actions = {};
		actions['fwd'] = { label: 'Forward'},
		actions['rev'] = { label: 'Reverse'},
		actions['boOn'] = { label: 'Black Out on'},
		actions['boOff'] = { label: 'Black Out off'}
		
		return actions;
	}
}
