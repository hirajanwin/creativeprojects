import { Event } from 'three';

import { MouseMove } from './MouseMove/MouseMove';
import { UpdateInfo } from './types';
import { getLength } from './utils/getLength';

export class Catapult {
  _mouseMove: MouseMove;
  _mouseX = 0;
  _mouseY = 0;
  _touchedX = 0;
  _touchedY = 0;
  _isTouching = false;

  constructor(mouseMove: MouseMove) {
    this._mouseMove = mouseMove;
  }

  init() {
    this._addEventListeners();
  }

  _onMouseDown = (e: Event) => {
    this._isTouching = true;
    this._touchedX = (e.target as MouseMove).mouse.x;
    this._touchedY = (e.target as MouseMove).mouse.y;
    this._mouseX = this._touchedX;
    this._mouseY = this._touchedY;
  };

  _onMouseUp = (e: Event) => {
    this._isTouching = false;
  };

  _onMouseMove = (e: Event) => {
    this._mouseX = (e.target as MouseMove).mouse.x;
    this._mouseY = (e.target as MouseMove).mouse.y;
  };

  _addEventListeners() {
    this._mouseMove.addEventListener('down', this._onMouseDown);
    this._mouseMove.addEventListener('up', this._onMouseUp);
    this._mouseMove.addEventListener('mousemoved', this._onMouseMove);
  }

  _removeEventListeners() {
    this._mouseMove.removeEventListener('down', this._onMouseDown);
    this._mouseMove.removeEventListener('up', this._onMouseUp);
    this._mouseMove.removeEventListener('mousemoved', this._onMouseMove);
  }

  destroy() {
    this._removeEventListeners();
  }

  _draw(ctx: CanvasRenderingContext2D) {
    if (this._isTouching) {
      this._drawLine(ctx);
      this._drawPowerCircle(ctx);
    }
  }

  _drawLine(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this._touchedX, this._touchedY);
    ctx.lineTo(this._mouseX, this._mouseY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }

  _drawPowerCircle(ctx: CanvasRenderingContext2D) {
    const distance = getLength(
      this._mouseX,
      this._mouseY,
      this._touchedX,
      this._touchedY,
    );
    ctx.beginPath();
    ctx.arc(this._mouseX, this._mouseY, distance * 0.1, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }

  update(updateInfo: UpdateInfo, ctx: CanvasRenderingContext2D) {
    this._draw(ctx);
  }
}
