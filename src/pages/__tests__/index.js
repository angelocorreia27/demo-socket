
import React from "react";
import { render, screen } from '@testing-library/react';
import { useStaticQuery } from "gatsby";

import IndexPage from "../index";


describe("Websocket Chart component", () => {

  beforeEach(() => {
    useStaticQuery.mockReturnValue({
      site: {
        siteMetadata: {
          title: `Gatsby Starter Websocket Chart`,
          description: `A starter demonstrating Websocket Chart.`,
          social: {
            linkedin: `ângelo-correia-33427819a`,
          },
        },
      },
    })
  })

  
  it("renders the tests correctly", async () => {

    const mockData = {
        siteMetadata: {
            title: `Gatsby Default Starter`,
            description: `A starter demonstrating Websocket Chart`,
            author: `Angelo Correia`,
            social: {
              linkedin: `ângelo-correia-33427819a`,
            },
          },
        
        
      }

     render(
      <IndexPage />
     )
    
    // Just check if everything's render ok
     expect( screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'h1' && content.startsWith('Hi Wiliot')
    })).toBeTruthy;

  })
})