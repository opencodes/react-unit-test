import React from 'react';
import { shallow } from 'enzyme';
import DashboardContainer from './DashboardContainer';

jest.mock("../services/app.services");


    it("fetches images from unsplash and renders them on mount", done => {
        const wrapper = shallow(<DashboardContainer />);
      
        setTimeout(() => {
          wrapper.update();
      
          const state = wrapper.instance().state;
          expect(state.loaded).toEqual(true);
          expect(state.users.length).toEqual(10);
          expect(wrapper.find("h1").length).toEqual(10);
          done();
        });
      });
