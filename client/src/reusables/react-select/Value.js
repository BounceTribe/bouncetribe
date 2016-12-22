/* eslint-disable */

import React from 'react';
import classNames from 'classnames';
import {btLight, btWhite, btTeal} from 'styling/T'
import styled from 'styled-components'

const ChipContainer = styled.div`
  height: 30px;
  background-color: ${btLight};
  color: ${btWhite};
  display: inline-flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  border-radius: 30px;
  margin: 3px;
	&:hover {
  	box-shadow: 0 0 10px ${btTeal};
	}
`

const ChipImage = styled.img`
	width: 30px;
	height: 100%;
	display: flex;
	border-radius: 30px;
`

const RemoveIcon = styled.button`
	height: 30px;
	width: 30px;
	border-radius: 30px;
	color: ${btWhite};
	cursor: pointer;
`

const Value = React.createClass({

	displayName: 'Value',

	propTypes: {
		children: React.PropTypes.node,
		disabled: React.PropTypes.bool,               // disabled prop passed to ReactSelect
		id: React.PropTypes.string,                   // Unique id for the value - used for aria
		onClick: React.PropTypes.func,                // method to handle click on value label
		onRemove: React.PropTypes.func,               // method to handle removal of the value
		value: React.PropTypes.object.isRequired,     // the option object for this value
	},

	handleMouseDown (event) {
		if (event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		if (this.props.onClick) {
			event.stopPropagation();
			this.props.onClick(this.props.value, event);
			return;
		}
		if (this.props.value.href) {
			event.stopPropagation();
		}
	},

	onRemove (event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onRemove(this.props.value);
	},

	handleTouchEndRemove (event){
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if(this.dragging) return;

		// Fire the mouse events
		this.onRemove(event);
	},

	handleTouchMove (event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart (event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	renderRemoveIcon () {
		if (this.props.disabled || !this.props.onRemove) return;
		return (
			<RemoveIcon
				onMouseDown={this.onRemove}
				onTouchEnd={this.handleTouchEndRemove}
				onTouchStart={this.handleTouchStart}
				onTouchMove={this.handleTouchMove}>
				&times;
			</RemoveIcon>
		);
	},

	renderLabel () {
		let className = 'Select-value-label';
		return this.props.onClick || this.props.value.href ? (
			<a className={className} href={this.props.value.href} target={this.props.value.target} onMouseDown={this.handleMouseDown} onTouchEnd={this.handleMouseDown}>
				{this.props.children}
			</a>
		) : (
			<span className={className} role="option" aria-selected="true" id={this.props.id}>
				{this.props.children}
			</span>
		);
	},

	render () {
		console.log('this.props.value', this.props.value)
		return (
			<ChipContainer
				title={this.props.value.title}
			>
				<ChipImage
          src={this.props.value.value.imageUrl}
          alt={this.props.label}
        />
				{this.renderLabel()}
				{this.renderRemoveIcon()}
			</ChipContainer>

		);
	}

});

module.exports = Value;
