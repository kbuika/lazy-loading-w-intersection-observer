<h1 align="center">Photo Gallery</h1>

<div align="center">
  <h3>
    <a href="https://kisi-marketplace-challenge.vercel.app/" target="_blank">
      Live Demo
    </a>
    
  </h3>
</div>

<p align=center>A simple and snappy photo gallery.</p>

## Features

- Responsive grid layout: The grid layout adjusts dynamically based on the viewport size, providing an optimal viewing experience across different devices.
- Lazy loading: Photos are lazily loaded as the user scrolls down the page, improving performance by only loading images that are in the viewport.
- Full-resolution viewing: Users can click on a photo to view it in full resolution, along with navigation buttons to move between photos.
- Keyboard navigation: Users can navigate between photos using the left and right arrow keys when a photo is in full-resolution mode.

## Technologies Used

- React
- Vite
- Intersection Observer API - Used for lazy loading images as they come into the viewport.
- Cypress - for testing

## Getting Started

My choice for `vite` is purely because it provides a quick way to bundle the application. As an alternative, I would have used webpack.

To run the application here are some major prerequisites

    - React
    - Vite

#### Installing dependencies

```bash
    npm install
```

#### Running the application

```bash
    npm run dev
```

#### Running tests

Make sure the local server has started on port `5173`

```bash
    npm run cy:run-e2e
```

### Caveats on the tests

Testing the responsive design proved to be a bit of uphill battle. For some reason, the `.should()` to assert the `grid-template-columns` returned a number.
This left me with the option of either having to calculate the columns or just checking for the negation of the test ( checking whether a property is absent, because it shouldn't be present ). That said, I will still put in the time to find the best way to test a responsive design.
