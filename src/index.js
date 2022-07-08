import React from 'react';
import ReactDOM from 'react-dom';
import { Stage, Shape, Container, Text, Ticker } from '@createjs/easeljs';
import { Tween, Ease } from "@createjs/tweenjs";
import spin from './spinTxt.svg';
import './index.css';

class SpinnerWheel extends React.Component {

  isClicked = (event, arg) => {
    alert(arg);
  }

  handleMouseOver = (e, data) => {
    var hovered_size = this.size * 1.05; 
    data.shape_data.graphics.clear().f("#181818")
      .mt(0, 0)
      .lt(Math.cos(this.angle * data.index) * hovered_size, Math.sin(this.angle * data.index) * hovered_size)
      .arc(0, 0, hovered_size, data.index * this.angle, data.index * this.angle + this.angle)
      .lt(0, 0);
    this.stage.update(e);
    console.log(5114);

  }

  handleMouseOut = (e, data) => {
    data.shape_data.graphics.clear().f(data.color)
      .mt(0, 0)
      .lt(Math.cos(this.angle * data.index) * this.size, Math.sin(this.angle * data.index) * this.size)
      .arc(0, 0, this.size, data.index * this.angle, data.index * this.angle + this.angle)
      .lt(0, 0);
    this.stage.update(e);
    console.log(54);
  }


  componentDidMount() {
    this.segments = [
      'Phaya Thai 2', 'Rutnin Eye Hospital', 'Samitivej', 'River Rihab',
      'Phaya Thai 2', 'Rutnin Eye Hospital', 'Samitivej', 'River Rihab',
      'Phaya Thai 2', 'Rutnin Eye Hospital', 'Samitivej', 'River Rihab',
      'Phaya Thai 2', 'Rutnin Eye Hospital', 'Samitivej', 'River Rihab',
      'Bangkok Hospital \n(pattaya)', 'Vejthani', 'Bumrungrad', 'Miracle Asia Rehab', 'MedPark'

    ];

    this.size = 265;
    const txt_size = 16;
    const offset = 80;
    this.total_segments = 20;

    const colors = [
      '#76C695',
      '#26B05F',
      '#A570B0',
      '#855CA6',
      '#76C695',
      '#26B05F',
      '#A570B0',
      '#855CA6',
      '#76C695',
      '#26B05F',
      '#A570B0',
      '#855CA6',
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

    this.stage = new Stage(canvas);
    this.stage.enableMouseOver();

    Ticker.timingMode = Ticker.RAF;

    this.c = new Container();

    this.angle = Math.PI * 2 / this.total_segments;

    // Draw a wheel 
    var angle_degree = 360 / this.total_segments;
    var rotation_const = 0;

    if (this.total_segments % 2 !== 0) rotation_const = angle_degree;

    var s = [];

    for (var i = 0, l = this.total_segments; i < l; i++) {
      s[i] = new Shape();
      s[i].graphics.f(colors[i])
        .mt(0, 0)
        .lt(Math.cos(this.angle * i) * this.size, Math.sin(this.angle * i) * this.size)
        .arc(0, 0, this.size, i * this.angle, i * this.angle + this.angle)
        .lt(0, 0);

      // Add text child
      var new_cont = new Container();

      new_cont.set({ regY: this.size - offset, rotation: (angle_degree * (i + 1) + rotation_const) - 5 });

      var txt = new Text(this.segments[i], (txt_size) + "px Arial", "#f5f5f5");
      txt.set({ rotation: 90, textAlign: "center" });

      new_cont.addChild(txt);

      this.c.addChild(new_cont);
      this.c.addChild(s[i]);

      s[i].on(
        'click', (e) => {
          this.isClicked(e, "your return msg")                       /***********  PASS ARGUMENT HERE!  ***********/

        }
      );

      s[i].on('mouseover', (e, data) => {
        this.handleMouseOver(e, data);
      }, null, false, { index: i, shape_data: s[i] });

      s[i].on('mouseout', (e, data) => {
        this.handleMouseOut(e, data);
      }, null, false, { index: i, shape_data: s[i], color: colors[i] });

    }

    this.c.x = this.c.y = this.size + 20;
    // this.c.cache(-size, -size, size * 2, size * 2);

    this.c.rotation = 0;
    this.stage.addChild(this.c);

    // Mode. 0=stopped, 1=moving, 2=stopping
    this.c.mode = 0;

    this.rotation_trace = 0;

    Ticker.on("tick", (event) => {
      this.stage.update(event);
    });
  }

  rotate_wheel = () => {
    this.rotation_trace += 360 / (this.total_segments / 2);
    Tween.get(this.c)
      .to({ rotation: this.rotation_trace }, 800, Ease.cubicOut)
      .call(() => { this.c.mode = 0; });
  }

  render() {
    return (
      <div className='spin-container'>
        <canvas id="spin-wheel" width="280" height="280"></canvas>
        <img className="spin-txt" src={spin} alt="Spin Wheel" onClick={this.rotate_wheel} />
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
