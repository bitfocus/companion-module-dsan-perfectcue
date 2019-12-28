module.exports = {

		/**
		* Get the available presets.
		*
		* @returns {Object[]} the available feedbacks
		* @access public
		* @since 1.1.0
		*/

		getPresets(updates) {
			var presets = [
				{
					category: 'Cue control',
					label: 'Forward',
					bank: {
						style: 'text',
						text: 'Forward',
						size: '14',
						color: '16777215',
						bgcolor: this.rgb(0,0,0),
					},
					actions: [
						{
							action: 'fwd',
						},
					],
					feedbacks: [
						{
							type: 'fwd',
							options: {
								fwd_on_bg: this.rgb(0,255,0),
								fwd_on_fg: this.rgb(255,255,255),
								fwd_off_bg: this.rgb(0,0,0),
								fwd_off_fg: this.rgb(255,255,255)							
							}
						}
					]
				},
				{
					category: 'Cue control',
					label: 'Reverse',
					bank: {
						style: 'text',
						text: 'Reverse',
						size: '14',
						color: '16777215',
						bgcolor: this.rgb(0,0,0),
					},
					actions: [
						{
							action: 'rev',
						},
					],
					feedbacks: [
						{
							type: 'rev',
							options: {
								rev_on_bg: this.rgb(255,0,0),
								rev_on_fg: this.rgb(255,255,255),
								rev_off_bg: this.rgb(0,0,0),
								rev_off_fg: this.rgb(255,255,255)							
							}
						}
					]
				},
				{
					category: 'Cue control',
					label: 'BlankOn',
					bank: {
						style: 'text',
						text: 'Blank On',
						size: '14',
						color: '16777215',
						bgcolor: this.rgb(0,0,0),
					},
					actions: [
						{
							action: 'boOn',
						},
					],
					feedbacks: [
						{
							type: 'blank',
							options: {
								blank_on_bg: this.rgb(255,255,0),
								blank_on_fg: this.rgb(0,0,0),
								blank_off_bg: this.rgb(0,0,0),
								blank_off_fg: this.rgb(255,255,255)							
							}
						}
					]
				},
				{
					category: 'Cue control',
					label: 'BlankOf',
					bank: {
						style: 'text',
						text: 'Blank Off',
						size: '14',
						color: '16777215',
						bgcolor: this.rgb(0,0,0),
					},
					actions: [
						{
							action: 'boOff',
						},
					],
					feedbacks: [
						{
							type: 'blank',
							options: {
								blank_on_bg: this.rgb(255,255,0),
								blank_on_fg: this.rgb(0,0,0),
								blank_off_bg: this.rgb(0,0,0),
								blank_off_fg: this.rgb(255,255,255)							
							}
						}
					]
				},
			];

			return presets;
		}
};
