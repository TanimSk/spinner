import React from 'react';
import ReactDOM from 'react-dom';
import { Stage, Shape, Container, Text, Ticker } from '@createjs/easeljs';
import { Tween, Ease } from "@createjs/tweenjs";
import spin from './spinTxt.svg';
import './index.css';

class SpinnerWheel extends React.Component {

  spinnerHovered = (event) =>{
    console.log(event.type);
  }

  spinnerClicked = (event, arg) => {
    alert(arg);
  }

  componentDidMount() {
    this.segments = [
      'Phaya Thai 2', 'Rutnin Eye Hospital', 'Samitivej', 'River Rihab',
      'Bangkok Hospital \n(pattaya)', 'Vejthani', 'Bumrungrad', 'Miracle Asia Rehab', 'MedPark'

    ];
    const size = 260;
    const txt_size = 19;
    const offset = 95;

    const colors = [
        '#76C695',
        '#26B05F',
        '#A570B0',
        '#855CA6',
        '#54CAF1',
        '#269BD7',
        '#F5CC4D',
        '#F59B4F',
        '#EC5857' 
      ];


    var canvas = ReactDOM.findDOMNode(
      document.getElementById('spin-wheel')
    );

    var stage = new Stage(canvas);
    stage.ena

    Ticker.timingMode = Ticker.RAF;

    this.c = new Container();
    
    var angle = Math.PI * 2 / this.segments.length;

    // Draw a wheel 
    var angle_degree = 360 / this.segments.length;
    var rotation_const = 0;

    if (this.segments.length % 2 !== 0) rotation_const = angle_degree;

    var s = [];

    for (var i = 0, l = this.segments.length; i < l; i++) {
      s[i] = new Shape();
      s[i].graphics.f(colors[i])
        .mt(0, 0)
        .lt(Math.cos(angle * i) * size, Math.sin(angle * i) * size)
        .arc(0, 0, size, i * angle, i * angle + angle)
        .lt(0, 0);

      // Add text child
      var new_cont = new Container();

      new_cont.set({ regY: size - offset, rotation: (angle_degree * (i + 1) + rotation_const) - 5 });

      var txt = new Text(this.segments[i], (txt_size) + "px Arial", "#f5f5f5");
      txt.set({ rotation: 90, textAlign: "center" });

      new_cont.addChild(txt);

      this.c.addChild(new_cont);
      this.c.addChildAt(s[i], 0);

      s[i].on(
        'click', (e)=>{
          this.spinnerClicked(e, "your return msg")                       /***********  PASS ARGUMENT HERE!  ***********/

        }
      ); 

    }

    this.c.x = this.c.y = size + 20;
    this.c.cache(-size, -size, size * 2, size * 2);

    this.c.rotation = 0;
    stage.addChild(this.c);

    // Mode. 0=stopped, 1=moving, 2=stopping
    this.c.mode = 0;

    this.rotation_trace = 0;

    Ticker.on("tick", (event) => {
      stage.update(event);
    });
  }

  rotate_wheel = () =>{
    this.rotation_trace += 360 / this.segments.length;
    Tween.get(this.c)
      .to({ rotation: this.rotation_trace }, 800, Ease.cubicOut)
      .call(()=>{ this.c.mode = 0; });
  }

  render() {
    return (
      <div className='spin-container'>
        <canvas id="spin-wheel" width="280" height="280"></canvas>
        <img className="spin-txt" src={spin} alt="Spin Wheel" onClick={this.rotate_wheel}/>
      </div>
      
    );
  }
}


ReactDOM.render(
  <div className='positionMe'>
    <SpinnerWheel />
  </div>,
  document.getElementById('root')
);
