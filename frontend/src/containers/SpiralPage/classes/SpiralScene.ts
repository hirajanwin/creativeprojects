import * as THREE from 'three';
import { StoryScene } from './StoryScene';
import { SpiralSpline } from './SpiralSpline';
import { UpdateInfo } from './types';
import { Scroll } from './Scroll/Scroll';
import { lerp } from './utils/lerp';

export class SpiralScene extends StoryScene {
  spiralSpline = new SpiralSpline();
  _scroll: Scroll;
  _currentIndexFloat = 0;
  zeroProgressOffset = 0.25;
  _targetYScroll = 0;
  _currentYScroll = 0;
  _lerpEase = 0.07;
  _scrollYMultiplier = 0.004;
  _itemSpacing = 0.056;

  constructor(camera: THREE.PerspectiveCamera, scroll: Scroll) {
    super(camera, scroll);

    this._scroll = scroll;

    this.camera.fov = 60;
    this.camera.position.z = this.spiralSpline.depth * 1.5;
  }

  positionItems = (updateInfo: UpdateInfo) => {
    this._currentIndexFloat = this._currentYScroll;

    this.storyItems.forEach((item, index) => {
      const dIndex = index - this._currentIndexFloat;

      const dProgress = dIndex * this._itemSpacing;

      const splineProgress = dProgress + this.zeroProgressOffset;
      const itemPosition = this.spiralSpline.getPointPosition(splineProgress);

      item.position.set(
        itemPosition.x + this.spiralSpline.position.x,
        itemPosition.y + this.spiralSpline.position.y,
        itemPosition.z + this.spiralSpline.position.z,
      );
      const opacity = 1 + (0.5 - dProgress - this.zeroProgressOffset) * 8;
      // item.setOpacity(opacity);
      const scale = Math.min(Math.pow(opacity, 0.2), 1);
      item.scale.set(scale, scale, scale);
    });
  };

  _onScrollApplied = (e: THREE.Event) => {
    const newTarget = this._targetYScroll - e.y * this._scrollYMultiplier;

    this._targetYScroll = Math.min(
      Math.max(0, newTarget),
      this.storyItems.length - 1,
    );
  };

  _lerpValues(updateInfo: UpdateInfo) {
    this._currentYScroll = lerp(
      this._currentYScroll,
      this._targetYScroll,
      this._lerpEase * updateInfo.slowDownFactor,
    );
  }

  _setListeners() {
    this._scroll.addEventListener('appliedscroll', this._onScrollApplied);
  }

  _removeListeners() {
    this._scroll.removeEventListener('appliedscroll', this._onScrollApplied);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this.positionItems(updateInfo);
    this._lerpValues(updateInfo);
  }
  destroy() {
    super.destroy();
    this._removeListeners();
  }

  init() {
    super.init();
    this._setListeners();

    this.spiralSpline.position.z = this.spiralSpline.depth;
    this.add(this.spiralSpline);
  }
}
