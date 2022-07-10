import React from 'react';
import ReactDOM from 'react-dom';
import { Stage, Shape, Container, Text, Ticker } from '@createjs/easeljs';
import { Tween, Ease } from "@createjs/tweenjs";
import spin from './spinTxt.svg';
import './index.css';

class SpinnerWheel extends React.Component {
  constructor() {
    super();

    this.segments = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56 ,57, 58, 59, 60
    ];

    // Array operations. Don't Modify
    this.array_trace = 0;
    this.get_init = 5;
    this.len = 2;
    this.skip = 2;
    this.spinner_txt_tracer = 20;
  }

  isClicked = (e, arg) => {
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
  }

  handleMouseOut = (e, data) => {
    data.shape_data.graphics.clear().f(data.color)
      .mt(0, 0)
      .lt(Math.cos(this.angle * data.index) * this.size, Math.sin(this.angle * data.index) * this.size)
      .arc(0, 0, this.size, data.index * this.angle, data.index * this.angle + this.angle)
      .lt(0, 0);
    this.stage.update(e);
  }


  componentDidMount() {

    const txt_size = 16;
    const offset = 80;
    this.size = 265;
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


    let canvas = ReactDOM.findDOMNode(
      document.getElementById('spin-wheel')
    );

    this.stage = new Stage(canvas);
    this.stage.enableMouseOver();

    Ticker.timingMode = Ticker.RAF;

    this.c = new Container();

    this.angle = Math.PI * 2 / this.total_segments;

    let angle_degree = 360 / this.total_segments;
    let s = [];
    this.text_obj = [];

    // draw a wheel
    for (let i = 0; i < this.total_segments; i++) {
      s[i] = new Shape();
      s[i].graphics.f(colors[i]).mt(0, 0)
        .lt(Math.cos(this.angle * i) * this.size, Math.sin(this.angle * i) * this.size)
        .arc(0, 0, this.size, i * this.angle, i * this.angle + this.angle)
        .lt(0, 0);
      this.c.addChildAt(s[i], 0);

      // Adding pseudo texts, then update via reference ;)
      let new_cont = new Container();
      new_cont.set({ regY: this.size - offset, rotation: (angle_degree * (i + 1)) - 5 });
      this.text_obj[i] = new Text('-', (txt_size) + "px Arial", "#f5f5f5");
      this.text_obj[i].set({ rotation: 90, textAlign: "center" });
      new_cont.addChild(this.text_obj[i]);
      this.c.addChild(new_cont);

      // Event Liseteners
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


    // Init text on segments 5
    let segment_new = this.get_array();
    for (let i = this.get_init; i > 0; i--) {
      this.text_obj[i - 1].text = segment_new[this.get_init - i];
    }


    // init state of wheel    
    this.stage.addChild(this.c);
    this.c.x = this.c.y = this.size + 20;
    this.c.rotation = 270;
    this.c.mode = 0;
    this.rotation_trace = this.c.rotation;

    Ticker.on("tick", (event) => {
      this.stage.update(event);
    });
  }


  rotate_wheel = () => {
    // Update text by adding two elements to segment
    let segment_new = this.get_array();
    for (let i = this.spinner_txt_tracer; i > this.spinner_txt_tracer - 2; i--) {
      this.text_obj[i-1].text = segment_new[this.spinner_txt_tracer-i];
    }
    this.spinner_txt_tracer -= 2;
    if (this.spinner_txt_tracer == 0) {
      this.spinner_txt_tracer = 20;
    }

    this.rotation_trace += 360 / (this.total_segments / 2);
    Tween.get(this.c)
      .to({ rotation: this.rotation_trace }, 800, Ease.cubicOut)
      .call(() => { this.c.mode = 0; });
  }



  get_array = () => {
    let new_array = [];
    let span = this.len + this.array_trace;
    let index = null;

    if (!this.array_trace) {
      this.array_trace += this.get_init;
      return this.segments.slice(0, this.get_init);
    }

    for (let i = this.array_trace; i < span; i++) {
      index = i;
      if (i > (this.segments.length - 1)) {
        index = i - parseInt(i / this.segments.length) * this.segments.length;
      }
      new_array.push(this.segments[index]);
    }
    this.array_trace += this.skip;

    return new_array;
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
