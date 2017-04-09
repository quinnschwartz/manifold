import React, { Component } from 'react';

export default class ResourceIconPresentation extends Component {

  static displayName = "Resource.Icon.Presentation";

  render() {
    return (
      <svg version="1.1"
        width="64.0012px" height="64px"
        viewBox="0 0 64.0012 64"
      >
        {/* Disable max-length on linter for long SVG path declarations */}
        {/* eslint-disable max-len */}
        <path d="M28.71287,64C12.88071,64,0,51.11929,0,35.28773C0,19.45557,12.88071,6.57546,28.71287,6.57546c0.67614,0,1.22434,0.5482,1.22434,1.22434v26.26358h26.26358c0.67673,0,1.22434,0.54761,1.22434,1.22434C57.42514,51.11929,44.54443,64,28.71287,64z M27.48853,9.05224C13.57239,9.69371,2.44869,21.21616,2.44869,35.28773c0,14.48168,11.78191,26.26358,26.26418,26.26358c14.07157,0,25.59402-11.1231,26.23489-25.03924H28.71287 c-0.67614,0-1.22434-0.54761-1.22434-1.22434V9.05224z"/>
        <path d="M62.77685,29.93661H35.28773c-0.67673,0-1.22434-0.5482-1.22434-1.22434V1.22434C34.06339,0.5482,34.611,0,35.28773,0C51.12049,0,64.0012,12.88011,64.0012,28.71227C64.0012,29.38841,63.45359,29.93661,62.77685,29.93661z M36.51207,27.48793h25.01174C60.90208,13.97771,50.02288,3.09971,36.51207,2.47678V27.48793z"/>
        {/* eslint-enable max-len */}
      </svg>
    );
  }
}
