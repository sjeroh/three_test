var myAnimation = new hoverEffect({
  parent: document.querySelector('.my-div'),
  intensity: 0.3,
  image1: 'img/my_2.jpg',
  image2: 'img/my_1.jpg',
  displacementImage: 'img/displacement/3.jpg',
  imagesRatio:500/600
});
var myAnimation2 = new hoverEffect({
  parent: document.querySelector('.m2'),
  intensity: 0.3,
  image1: 'img/my_3.jpg',
  image2: 'img/my_4.png',
  displacementImage: 'img/displacement/2.jpg',
  imagesRatio:500/600

});
var myAnimation3 = new hoverEffect({
  parent: document.querySelector('.m3'),
  intensity: 0.3,
  image1: 'img/my_5.jpg',
  image2: 'img/my_6.png',
  displacementImage: 'img/displacement/13.jpg',
  imagesRatio:500/600

});

VanillaTilt.init(document.querySelectorAll(".tiltEle"), {
  max: 5,
  speed: 1500
});

//It also supports NodeList
// VanillaTilt.init(document.querySelectorAll(".tiltEle"));


