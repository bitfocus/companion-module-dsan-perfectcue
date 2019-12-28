module.exports = {

		/**
		* Get the available feedbacks.
		*
		* @returns {Object[]} the available feedbacks
		* @access public
		* @since 1.1.0
		*/

		getFeedbacks() {
			var feedbacks = {}

			feedbacks['fwd'] = {
				label: 'Change color from FWD state',
				description: 'Change the colors of a bank according to the Fwd state',
				options: [
					{
						type: 'colorpicker',
						label: 'FWD_ON: Foreground color',
						id: 'fwd_on_fg',
						default: this.rgb(255,255,255)
					},
					{
						type: 'colorpicker',
						label: 'FWD_ON: Background color',
						id: 'fwd_on_bg',
						default: this.rgb(0,255,0)
					},
					{
						type: 'colorpicker',
						label: 'FWD_off: Foreground color',
						id: 'fwd_off_fg',
						default: this.rgb(255,255,255)
					},
					{
						type: 'colorpicker',
						label: 'FWD_off: Background color',
						id: 'fwd_off_bg',
						default: this.rgb(0,0,0)
					}

				],
				callback: (feedback, bank) => {
					if (this.feedbackstate.fwd == 'on') {
						return {
							color: feedback.options.fwd_on_fg,
							bgcolor: feedback.options.fwd_on_bg
						};
					}
					if (this.feedbackstate.fwd == 'off') {
						return {
							color: feedback.options.fwd_off_fg,
							bgcolor: feedback.options.fwd_off_bg
						}
					}
				}
			},
			feedbacks['rev'] = {
				label: 'Change color from REV state',
				description: 'Change the colors of a bank according to the rev state',
				options: [
					{
						type: 'colorpicker',
						label: 'REV_ON: Foreground color',
						id: 'rev_on_fg',
						default: this.rgb(255,255,255)
					},
					{
						type: 'colorpicker',
						label: 'REV_ON: Background color',
						id: 'rev_on_bg',
						default: this.rgb(255,0,0)
					},
					{
						type: 'colorpicker',
						label: 'REV_off: Foreground color',
						id: 'rev_off_fg',
						default: this.rgb(255,255,255)
					},
					{
						type: 'colorpicker',
						label: 'REV_off: Background color',
						id: 'rev_off_bg',
						default: this.rgb(0,0,0)
					}

				],
				callback: (feedback, bank) => {
					if (this.feedbackstate.rev == 'on') {
						return {
							color: feedback.options.rev_on_fg,
							bgcolor: feedback.options.rev_on_bg
						};
					}
					if (this.feedbackstate.rev == 'off') {
						return {
							color: feedback.options.rev_off_fg,
							bgcolor: feedback.options.rev_off_bg
						}
					}
				}
			},
			feedbacks['blank'] = {
				label: 'Change color from Blank state',
				description: 'Change the colors of a bank according to the Blank state',
				options: [
					{
						type: 'colorpicker',
						label: 'Blank_ON: Foreground color',
						id: 'blank_on_fg',
						default: this.rgb(0,0,0)
					},
					{
						type: 'colorpicker',
						label: 'Blank_ON: Background color',
						id: 'blank_on_bg',
						default: this.rgb(255,255,0)
					},
					{
						type: 'colorpicker',
						label: 'Blank_off: Foreground color',
						id: 'blank_off_fg',
						default: this.rgb(255,255,255)
					},
					{
						type: 'colorpicker',
						label: 'Blank_off: Background color',
						id: 'blank_off_bg',
						default: this.rgb(0,0,0)
					}

				],
				callback: (feedback, bank) => {
					if (this.feedbackstate.blank == 'on') {
						console.log('yellow led on')
						return {
							color: feedback.options.blank_on_fg,
							bgcolor: feedback.options.blank_on_bg
							
						};
					}
					if (this.feedbackstate.blank == 'off') {
						console.log('yellow led off')
						return {
							color: feedback.options.blank_off_fg,
							bgcolor: feedback.options.blank_off_bg
						};
					}
				}
			}
			return feedbacks;
		}
}
