import React, { Component } from 'react';
import './VolumeCalibrationInstructions.css';
import { Redirect } from "react-router-dom";
import { playWhiteNoiseTest } from '../lib/Stim.js'; 
import { setWhiteNoiseDb } from '../lib/Stim.js';

class VolumeCalibration1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            continue: false,
            volumeLevel: 80, // Initial volume level
            decreaseCount: 0, // Counter for the number of times volume is decreased
            redirect: null // State to manage redirection
        }
        this.audioContext = new AudioContext(); // Creating an AudioContext for playing the white noise
    }

    playNoise = () => {
        console.log("Calling playWhiteNoiseTest with volume:", this.state.volumeLevel);
        playWhiteNoiseTest(this.audioContext, this.state.volumeLevel); // Play white noise with current volume level
    }
    decreaseVolume = () => {
        if (this.state.decreaseCount < 1) {
            this.setState(prevState => ({
                volumeLevel: prevState.volumeLevel - 3, // Decrease by 5 dB
                decreaseCount: prevState.decreaseCount + 1
            }), () => {
                setWhiteNoiseDb(this.state.volumeLevel); // Update the volume in Stim.js
                this.audioContext.close().then(() => {
                    this.audioContext = new AudioContext();
                    this.playNoise(); // Play the noise again with the updated volume
                    this.setState({ redirect: "/VolumeCalibration2" }); // Set redirect after volume update
                });
            });
        }
    }

    keyFunction = (event) => {
        if(event.keyCode === 81) { // If 'Q' is pressed
            this.setState({ continue: true });
        } else if (event.keyCode === 69) { // If 'E' is pressed
            this.decreaseVolume();
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.keyFunction, false);
        this.playNoise(); // Play white noise when component mounts
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyFunction, false);
    }

    render() {
        if(this.state.continue === true){
            return <Redirect to="/Instructions" /> // Redirect to the Instructions page when 'Q' is pressed
        } else if (this.state.redirect) {
            return <Redirect to={this.state.redirect} /> // Redirect to the next volume calibration step when 'E' is pressed
        }

        return (
            <div className="VolumeInstructions">
                <input type="hidden"/>
                <header className="VolumeInstructions-header">
                <div className="text-container">
                    <p className="VolumeInstructions-text">
                        Is this noise loud but tolerable?
                        <br /><br /> IF ACCEPTABLE: <b>Press Q</b> to continue to the Hearing Test Instructions
                        <br /><br /> IF INTOLERABLE: <b>Press E</b> to try a lower volume 
                        <br /><br /> Adjustments so far: <b>0</b>
                    </p>
                </div>
                </header>
            </div>
        );
    }
}

export default VolumeCalibration1;
//old decreasevolume which called playNoise function immediately after setWhiteNoiseDb, but before the state's volumeLevel was updated.
// decreaseVolume = () => {
//     if (this.state.decreaseCount < 1) { // Allowing only one decrease
//         this.setState(prevState => ({
//             volumeLevel: prevState.volumeLevel - 15, // Decrease by 15 dB
//             decreaseCount: prevState.decreaseCount + 1
//         }), () => {
//             setWhiteNoiseDb(this.state.volumeLevel); // Update the volume in Stim.js
//             this.audioContext.close().then(() => {
//                 this.audioContext = new AudioContext();
//                 this.playNoise(); // Play the noise again with the updated volume
//             });
//             this.setState({ redirect: "/VolumeCalibration2" }); // Redirect to VolumeCalibration2.js
//         });
//     }
// }

//old decrease volume which didn't recreate audiocontext each time
// decreaseVolume = () => {
      //   if (this.state.decreaseCount < 5) {
      //     this.setState(prevState => ({
      //       volumeLevel: prevState.volumeLevel - 15, // Decrease by 15 dB
      //       decreaseCount: prevState.decreaseCount + 1
      //     }), () => {
      //       console.log("Decreased volume to:", this.state.volumeLevel);
      //       setWhiteNoiseDb(this.state.volumeLevel); // Update the volume in Stim.js this.state.volumeLevel is the argument newdB
      //       this.playNoise(); // Play the noise again with the updated volume
      //     });
      //   } else {
      //     console.log("Maximum decreases reached");
      //   }
      // }
      //this decrease volume creates a new AudioContext which could cause  performance issues!!!