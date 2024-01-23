import React, { Component } from 'react';
import './VolumeCalibrationInstructions.css';
import { Redirect } from "react-router-dom";
import { playWhiteNoise } from '../lib/Stim.js'; 
import { setWhiteNoiseDb } from '../lib/Stim.js';


class VolumeCalibrationInstructions extends Component {

    constructor(props) {
        super(props);
        this.state = {
          continue: false,
          volumeLevel: 80, // Initial volume level
          decreaseCount: 0 // Counter for the number of times volume is decreased
        }
        this.audioContext = new AudioContext(); // Creating an AudioContext for playing the white noise
      }

      // playNoise = () => {
      //   console.log("Calling playWhiteNoise with volume:", this.state.volumeLevel);
      //   playWhiteNoise(this.audioContext, this.state.volumeLevel); // Play white noise with current volume level
      // }
      

      
      decreaseVolume = () => { 
        if (this.state.decreaseCount < 5) {
            this.setState(prevState => ({
                volumeLevel: prevState.volumeLevel - 15, // Decrease by 15 dB
                decreaseCount: prevState.decreaseCount + 1
            }), () => {
                setWhiteNoiseDb(this.state.volumeLevel); // Update the volume in Stim.js
                // Recreate the audio context to force update
                this.audioContext.close().then(() => {
                    this.audioContext = new AudioContext();
                    this.playNoise(); // Play the noise again with the updated volume
                });
            });
        }
    }
    

      keyFunction = (event) => {
        if(event.keyCode === 81) { // If 'Q' is pressed
          this.setState({ continue: true });
        } //else if (event.keyCode === 69) { // If 'E' is pressed
          //this.decreaseVolume();
        //}
      }

      componentDidMount(){
        document.addEventListener("keydown", this.keyFunction, false);
        //this.playNoise(); // Play white noise when component mounts
      }

      componentWillUnmount(){
        document.removeEventListener("keydown", this.keyFunction, false);
      }

      render() {
        if(this.state.continue === true){
          return <Redirect to="/VolumeCalibration1" /> // Redirect to the Instructions page before practice trial component when 'Q' is pressed
        }

        return (
          <div className="VolumeInstructions">
            <input type="hidden"/>
            <header className="VolumeInstructions-header">
            <div className="text-container">
              <p className="VolumeInstructions-text">
              BEFORE WE BEGIN: This game plays a white noise in the background. Rarely, it is intolerably loud at first.
              <br /><br /> We will play the white noise for you. It should be loud but not intolerable.
              <br /><br /> <b>Do not change your computer volume!</b>
              <br /><br /> If the noise is <b>intolerable</b>, <b>press "E"</b> and we will decrease the volume and play it again.
              <br /><br /> ONLY HIT "E" if you <b>absolutely need to</b>. REMEMBER it <b>should be loud</b>!
              <br /><br /> You will have the option to hit "E" again if it is still intolerably loud
              <br /><br /> If the <b>volume is tolerable</b> then  <b>press "Q"</b> and the game will continue!
              <br /><br /> <b> Press Q to check the white noise volume</b> 
              </p>
            </div>
            </header>
          </div>
        );
      }
    }

    export default VolumeCalibrationInstructions;

    //old decrease volume function w/o creating new audiocontext
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