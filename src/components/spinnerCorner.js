import React from 'react';
import ReactDOM from "react-dom";
import { Stage, Shape, Container, Text, Ticker } from '@createjs/easeljs';
import { Tween, Ease } from "@createjs/tweenjs";
import spin from './spinTxt.svg';
import './index.css';


class SpinnerCorner extends React.Component {
    constructor(props) {
        super(props);

        this.segments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
            18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

        this.data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '11', '22', '33', '444'];

        this.size = 265;
        this.total_segments = 20;

        // Spinner, Array operations. Don't Modify
        this.array_trace = 0;
        this.get_init = 5;
        this.len = 2;
        this.skip = 2;
        this.spinner_txt_tracer = 20;
        this.segment_angle = 360 / (this.total_segments / this.skip);
    }


    isClicked = (data) => {
        console.log(data);
    }

    isHovered = (data) => {
        console.log(data);
    }

    handleMouseOver = (e, data) => {
        let hovered_size = this.size * 1.06;
        data.shape_data.graphics.clear().f(data.color)
            .mt(0, 0)
            .lt(Math.cos(this.angle * data.index) * hovered_size, Math.sin(this.angle * data.index) * hovered_size)
            .arc(0, 0, hovered_size, data.index * this.angle, data.index * this.angle + this.angle)
            .lt(0, 0);
        this.stage.update(e);
        this.isHovered(data.info);
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
        const txt_angle = 5;
        const offset = 80;

        this.colors = [
            '#bb2c71', '#bc1f43', '#845ca6', '#79b44e', '#737476',
            '#845ca6', '#eb912e', '#737476', '#79b44e', '#bc1f43',
            '#737476', '#845ca6', '#bb2c71', '#00a7c7', '#eb912e',
            '#bc1f43', '#737476', '#845ca6', '#eb912e', '#79b44e'
        ];


        let canvas = ReactDOM.findDOMNode(
            document.getElementById('spin-wheel')
        );

        this.stage = new Stage(canvas);
        this.stage.enableMouseOver();
        this.c = new Container();

        Ticker.timingMode = Ticker.RAF;

        this.angle = Math.PI * 2 / this.total_segments;
        let angle_degree = 360 / this.total_segments;

        this.s = [];
        this.eventTraces = [];
        this.hoverEventTraces = [];
        this.text_obj = [];

        // draw a wheel
        for (let i = 0; i < this.total_segments; i++) {
            this.s[i] = new Shape();
            this.s[i].graphics.f(this.colors[i]).mt(0, 0)
                .lt(Math.cos(this.angle * i) * this.size, Math.sin(this.angle * i) * this.size)
                .arc(0, 0, this.size, i * this.angle, i * this.angle + this.angle)
                .lt(0, 0);
            this.c.addChildAt(this.s[i], 0);

            // Adding pseudo texts, then update via reference
            let new_cont = new Container();
            new_cont.set({ regY: this.size - offset, rotation: (angle_degree * (i + 1)) - txt_angle });
            this.text_obj[i] = new Text('-', (txt_size) + "px Arial", "#f5f5f5");
            this.text_obj[i].set({ rotation: 90, textAlign: "center" });
            new_cont.addChild(this.text_obj[i]);
            this.c.addChild(new_cont);

            // Event Liseteners
            this.eventTraces[i] = this.s[i].on('click', (e) => {
                this.isClicked(null);
            });
            this.hoverEventTraces[i] = this.s[i].on('mouseover', (e, data) => {
                this.handleMouseOver(e, data);
            }, null, false, { index: i, shape_data: this.s[i], color: this.colors[i], info: null });

            this.s[i].on('mouseout', (e, data) => {
                this.handleMouseOut(e, data);
            }, null, false, { index: i, shape_data: this.s[i], color: this.colors[i] });
        }


        // Init text on segments 5
        let [segment_new, new_data] = this.get_array();
        for (let i = this.get_init; i > 0; i--) {
            this.text_obj[i - 1].text = segment_new[this.get_init - i];
            /*click event listener*/
            this.initEvents(this.total_segments - i, new_data[4 - this.get_init + i], new_data[4 - this.get_init + i]);
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


    initEvents = (index, clickData, HoverData) => {
        this.s[index].off('click', this.eventTraces[index]);
        this.eventTraces[index] = this.s[index].on('click', (e, data) => {
            this.isClicked(data.info);
        }, null, false, { info: clickData }
        );
        this.s[index].off('mouseover', this.hoverEventTraces[index]);
        this.hoverEventTraces[index] = this.s[index].on('mouseover', (e, data) => {
            this.handleMouseOver(e, data);
        }, null, false, { index: index, shape_data: this.s[index], color: this.colors[index], info: HoverData }
        );
    }


    rotate_wheel = () => {

        // Update text by adding two elements to segment
        let [segment_new, new_data] = this.get_array();
        for (let i = this.spinner_txt_tracer; i > this.spinner_txt_tracer - 2; i--) {
            this.text_obj[i - 1].text = segment_new[this.spinner_txt_tracer - i];

            if (i < 6) {
                this.initEvents(
                    i - this.get_init + this.total_segments - 1, new_data[this.spinner_txt_tracer - i], new_data[this.spinner_txt_tracer - i]
                );
            }

            else {
                this.initEvents(
                    i - this.get_init - 1, new_data[this.spinner_txt_tracer - i], new_data[this.spinner_txt_tracer - i]
                );
            }

        }


        this.spinner_txt_tracer -= 2;
        if (this.spinner_txt_tracer === 0) {
            this.spinner_txt_tracer = this.total_segments;
        }

        // Animating Rotation
        this.rotation_trace += this.segment_angle;
        Tween.get(this.c)
            .to({ rotation: this.rotation_trace }, 800, Ease.cubicOut)
            .call(() => { this.c.mode = 0; });
    }


    get_array = () => {
        let new_array = [];
        let new_data = [];
        let span = this.len + this.array_trace;
        let index = null;

        if (!this.array_trace) {
            this.array_trace += this.get_init;
            return [this.segments.slice(0, this.get_init), this.data.slice(0, this.get_init)];
        }

        for (let i = this.array_trace; i < span; i++) {
            index = i;
            if (i > (this.segments.length - 1)) {
                index = i - parseInt(i / this.segments.length) * this.segments.length;
            }
            new_array.push(this.segments[index]);
            new_data.push(this.data[index])
        }
        this.array_trace += this.skip;

        return [new_array, new_data];
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


export default SpinnerCorner;


