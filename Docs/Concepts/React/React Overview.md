# React Overview

Single Page Application (SPA): Traditional website (static), whole page was loaded. In Single Page Application (SPA), components are shared and reusable as needed. Specific sections (components) of the web app are loaded based on user input not the entire page. 

## Hooks
Components contain the logic which can be a mixture of Javascript, CSS and HTML. Components are Javascript functions that return something that looks like HTML, but it is called JSX which is a combination of Javascript and XML. ClassName instead of class, sylte provided in the object, etc. 

## Hooks

- useState: Keep track of changes within the component. 

![alt text](/Docs/Concepts/React/Images/useState.png)


## Virtual DOM

- React creates a copy of the actual Document Object Model (DOM). Whenever a change occurs, React computes the difference between the Virtual and Actual DOM, then updates the actual DOM with the difference.  
