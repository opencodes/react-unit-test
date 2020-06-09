import React from 'react';
import { TileView } from './TileView';
import { shallow, mount } from 'enzyme';


    const props = {users: [
        {
            name :'Rajesh'
        }
    ]};
    let wrapper;
    
    beforeEach(()=>{
         wrapper = shallow(<TileView {...props}/>,'');
    })
    it('Initial count should be 0', ()=>{
        const count = wrapper.find('#counter').text();
        expect(count).toEqual('0');
    })
    it('Initial count should be 0', ()=>{
        wrapper.find('button').simulate('click');
        const count = wrapper.find('#counter').text();
        expect(count).toEqual('1');
    })
    it('Initial count should be 0', ()=>{
        wrapper.find('button').simulate('click');
        wrapper.find('button').simulate('click');
        wrapper.find('button').simulate('click');
        const count = wrapper.find('#counter').text();
        expect(count).toEqual('3');
    })
    it('Initial count should be 0', ()=>{
        wrapper = shallow(<TileView {...props}/>,'');
        const input = wrapper.find('input');
        input.simulate('change',{
            target:{value: 'raj'}
        })
        const count = wrapper.find('#textField').text();
        expect(count).toEqual('raj');

        expect(wrapper.find('input').props().value).toEqual('raj');
    })
