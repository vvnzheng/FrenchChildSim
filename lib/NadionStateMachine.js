// Simple State Machine (from Nadion Plug-In)
// Adapted from Joshua Shepard: https://github.com/jcd-as/nadion/blob/master/src/statemachine.js
// Updated to ESM6 and commented by Nathan Altice 

class StateMachine {
	constructor(states, receiver) {
		this.states = states; 			// JSON object that holds all states
		this.receiver = receiver; 		// the object that 'receives' the state
		this.initialState = undefined; 	// the object's initial state
		this.indices = {}; 				// used for fast lookup of events and states

		// initialize indices and find the initial state
		for (let i = 0; i < states.length; i++) {
			this.indices[this.states[i].name] = i;
			if (this.states[i].initial) {
				this.initialState = this.states[i];
			}
		}
		// warn if there's no initial state
		if (!this.initialState) {
			console.warn("State Machine has no initial state!");
		}
		// set current state to initial state
		this.currentState = this.initialState;
	}

	// consume an event and cause a new state to be entered
	consumeEvent(event) {
		if (this.currentState.events[event]) {
			this.currentState = this.states[this.indices[this.currentState.events[event]]];
		} else {
			console.warn(`State Machine called with invalid event: ${event} for current state: ${this.currentState.name}.`);
		}
	}

	// retrieve the name of the current state
	getState() {
		return this.currentState;
	}

	// reset the state machine to its initial state
	reset() {
		this.currentState = this.initialState;
	}
}