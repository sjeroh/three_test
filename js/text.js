let pTag1 = document.querySelector('.first-parallel')
let pTag2 = document.querySelector('.second-parallel')

// let textArr1 = 'CAUTION STOP CAUTION STOP CAUTION STOP CAUTION STOP'.split(" "); //띄워쓰기를 기준으로 잘라서 배열
let textArr1 = '. . About. me . . About . me . . About . me . . About . me . . About . me . . About . me . .'.split(" "); //띄워쓰기를 기준으로 잘라서 배열
// console.log(textArr1)

let textArr2 = '. my . portfolio . works . my . portfolio . works . my . portfolio . works . my . portfolio . works . my . portfolio . works'.split(' ');
// // console.log(textArr2)


// let arr=[];
// arr.push(...textArr1);
// console.log(arr)

let count1 = 0;
let count2 = 0;


initTexts(pTag1, textArr1)
initTexts(pTag2, textArr2)

function initTexts(element, textArry) {
  textArry.push(...textArry) //8개의 배열에 동일한 배열을 복사하여 배열뒤에 넣음 (16개)
  // console.log(textArry)
  for (let i = 0; i < textArry.length; i++) {
    // element.innerHTML = warn
    element.innerHTML += textArry[i] + '\u00A0\u00A0\u00A0';
    // element.insertAdjacentHTML('afterbegin',textArry[i],warn);
    
    // element.innerHTML +=`<i class="fas fa-exclamation-triangle"></i>`;
  }

  //    element.innerHTML +=`${textArry[i]}\u00A0\u00A0\u00A0`;
  //<i class="fas fa-exclamation-triangle"></i>
}

//------------------------글자입력

function animate() {
  count1++;
  count2++;
  // console.log(count1)

  count1 = marqueeText(count1, pTag1, -1)
  count2 = marqueeText(count2, pTag2, -1)

  window.requestAnimationFrame(animate)
  // animate();

}

function marqueeText(count, element, direction) {
  //console.log(element.scrollWidth)
  //scrollWidth ==> 보이지 않는 공간일지라도 스크롤해서 확인 할 수 있는 공간까지의 넓이, 전체 넓이
  if (count > element.scrollWidth / 2) {
    count = 0;
    element.style.transform = `translate(0,0)`
    
  }
  element.style.transform = `translate(${count * direction}px,0)`
  // console.log(count)
  return count;
}

function scrollHandler() {
  count1 += 25;
  count2 += 25;
}

animate();

window.addEventListener('scroll', scrollHandler)


// ---- click



let counterDate = $('.box h3');
let executed = false;
// let clickbt=$('.sec-2 .click_skill')

// $(window).scroll(function () {
//     let $click = $(this).scrollTop() -100 ;
//     let $offset = $('.easypiechart').offset().top;
//     if ($scroll > $offset) {
//         pieChart()

//         if (!executed) {
//             counterDate.each(function () {
//                 let currrent = $(this);
//                 let target = currrent.attr('data-rate'); // 90 85
//                 //A.animte({width:100%},시간,이징,끝나는할일)
//                 // $({변수:초기값}).animate({변수:종료값},{
//                 //     옵션
//                 // })
//                 $({rate: 0}).animate({rate: target}, {
//                     duration: 2500,
//                     progress: function () { //중간에 할일
//                         let now = this.rate;
//                         currrent.text(Math.ceil(now) + "%")
//                     }
//                 })
//             })
//             executed=true;
//         }
        

//     }
// })

$(window).scroll(function () {
  let $scroll = $(this).scrollTop() + 1300;
  let $offset = $('.easypiechart').offset().top;
  if ($scroll > $offset) {
      pieChart()

      if (!executed) {
          counterDate.each(function () {
              let currrent = $(this);
              let target = currrent.attr('data-rate'); // 90 85
              //A.animte({width:100%},시간,이징,끝나는할일)
              // $({변수:초기값}).animate({변수:종료값},{
              //     옵션
              // })
              $({rate: 0}).animate({rate: target}, {
                  duration: 2500,
                  progress: function () { //중간에 할일
                      let now = this.rate;
                      currrent.text(Math.ceil(now) + "%")
                  }
              })
          })
          executed=true;
      }
      

  }
})


// clickbt.click(function () {
//   let easychart = $('.easypiechart')
//   easychart.fadeToggle(800,'swing');
  
//   pieChart();
  
//   if (!executed) {
//     counterDate.each(function () {
//         let currrent = $(this);
//         let target = currrent.attr('data-rate');
//         $({ rate: 0 }).animate({ rate: target }, {
//             duration: 2500,
//             progress: function () {
//                 let now = this.rate;
//                 currrent.text(Math.ceil(now) + "%")
//             }
//         })
//     })
//     executed = true;
// }

// });


function pieChart() {
    $('.chart').easyPieChart({
        //your options goes here
        barColor: '#17d3e6',
        scaleColor: false,
        trackColor: '#373737',
        lineWidth: 12,
        size: 130,
        animate: 2000,
        lineCap: "butt"
    });

}



// --- skill bar

let offset=$('.po_ul').offset().top -400;//문서에서 .main위의 높이값
let executed2 =false;

$(window).scroll(function(){
    let wScroll=$(this).scrollTop();
    // console.log(wScroll)
    // console.log(offset+"off")
    if(wScroll>offset){
        if(!executed2){
            $('.skill-per').each(function(){
                let $this=$(this);
                let bar=$this.attr('bar');
                //A.attr(B)  A가가지고있는 B라는 속성의 값을 가져옴
                //A.attr(B,C) A가가지고있는 B를 C로 바꿔라는 의미
                console.log(bar)
                $this.css({width:bar+"%"})
                $({aniValue:0}).animate({aniValue:bar},{
                   duration:1000,
                   step:function(){//애니메이션 사이사이에 할일
                    $this.attr("bar",Math.ceil(this.aniValue) + "%")//this는 animate를 의미
                   }
                  })
            });
            executed2 = true;
        }
        
    }
})



let acc = document.querySelector('.buger_menu');

acc.addEventListener('click',function(e){
  e.preventDefault();
  this.classList.toggle('active')
  let panel=document.querySelector('.side_menu') 
  // 0--> false
  // 0을 제외한 숫자 -->true
  // scrollHeight:화면 바깥으로 삐져나간 부분까지 포함해서 전체의 글의 높이
  if(panel.style.right){
    panel.style.right=null;
  }else{
    panel.style.right='25vw';
  }
})


let texthover1= document.querySelector('.sec-1 .text1')

texthover1.addEventListener('mouseover',()=>{
  let hoverobj = document.querySelector('.sec-1 .text3')
  hoverobj.style.opacity='1';
})

