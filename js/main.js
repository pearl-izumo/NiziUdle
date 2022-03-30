"use strict";

{
  const namelist = ["MAKO","RIO","MAYA","RIKU","AYAKA","MAYUKA","RIMA","MIIHI","NINA","NIZIU"];
  const letterlist = [["A","H","I","K","M","N","O","R","U","Y"],["*","*","*","*","*","Z","O","*","*","*"]];
  const colorlist = ["#ff6a39","#71c5e8","#7f35b2","#f9e267","#ffffff","#00cfb4","#ba0c2f","#ecb3cb","#003da5","#222222"];
  const input = document.getElementById("input");
  const anscolor = ["#ffffff","#777c7e","#cab750","#50b264"];
  
  let keyset = [0,1,2,3,4,5,6,7,8,9];
  let visit = [0,0,0,0,0,0,0,0,0,0];
  let rotate_num = 0;
  let before = 1;
  let selected = 10;
  let answer_now = "";
  let outcolor = [];
  let memo = [];
  let last = 0;

  window.onload = onLoad();

  function total(array){
    let sum = 0;
    for(let j=0; j<array.length; j++){sum+=array[j]};
    return sum;
  };

  function onLoad(){
    create_key();
    shuffle(keyset);
    console.log(keyset);
    for(let j=0; j<5; j++){
      var div = document.createElement("div");
      div.classList.add("square2");
      div.style.backgroundColor = "#50b264";
      div.style.color = "#ffffff";
      div.innerText = namelist[9][j];
      document.getElementById("example").appendChild(div);
    };
  };

  document.getElementById("close").addEventListener("click", function(){
    document.getElementById("popup").style.display = "none";
  });

  document.getElementById("home").addEventListener("click", function(){
    location.reload();
  });

  document.getElementById("rotate").addEventListener("click",
  function(){
    if(rotate_num%2){
      for(let i=0; i<10; i++){
        document.getElementById("key"+i).classList.remove("rotate_left");
        document.getElementById("key"+i).classList.add("rotate_right");
      };
      document.getElementById("rotate_img").setAttribute("src","img/left.png")
    }else if(rotate_num==0){
      for(let i=0; i<10; i++){
        document.getElementById("key"+i).classList.add("rotate_left");
      };
      document.getElementById("rotate_img").setAttribute("src","img/right.png")
    }else{
      for(let i=0; i<10; i++){
        document.getElementById("key"+i).classList.remove("rotate_right");
        document.getElementById("key"+i).classList.add("rotate_left");
      };
      document.getElementById("rotate_img").setAttribute("src","img/right.png")
    };
    rotate_num+=1;
  });

  document.getElementById("retry").addEventListener("click", function(){
    location.reload();
  });
  
  var ans_i = document.querySelectorAll(".answer");
  for(let i=0; i<10; i++){
    ans_i[i].addEventListener("click", function(){
      if(i==9 && last==0){
        document.getElementById("ans10").classList.add("reject");
        setTimeout(function(){document.getElementById("ans10").classList.remove("reject")}, 600);
      }else if(visit[i]==0){
        input.style.backgroundColor = colorlist[i];
        create_input(i);
      }else{
        document.getElementById("ans"+(i+1)).classList.add("reject");
        setTimeout(function(){document.getElementById("ans"+(i+1)).classList.remove("reject")}, 600);
      };
    });
  };

  var key_i = document.querySelectorAll(".key");
  for(let i=0; i<10; i++){
    key_i[i].addEventListener("click", function(){
      var letter = letterlist[rotate_num%2][keyset[i]];
      var ans_len = answer_now.length;
      if(before==0 && ans_len!=namelist[selected].length){
        console.log(letter);
        document.getElementById("input"+selected+"_"+ans_len).innerText = i+1;
        answer_now+=letter;
      };
    });
  };

  document.getElementById("dlt").addEventListener("click", function(){
    if(before==0 && answer_now.length!=0){
      document.getElementById("input"+selected+"_"+(answer_now.length-1)).innerText = "";
      answer_now = answer_now.slice(0,-1);
    };
  });

  document.getElementById("enter").addEventListener("click", function(){
    if(before==0 && last==1){
      before = 1;
      visit[9] = 1;
      ans_check(answer_now);
      create_result(outcolor);
      for(let i=0; i<5; i++){
        let input_i = document.getElementById("input"+selected+"_"+i);
        setTimeout(function(){
          input_i.classList.add("ansturn");
          input_i.style.backgroundColor = anscolor[outcolor[i]+1];
          if(outcolor[i]!=-1){input_i.style.color = "#ffffff";};
          if(outcolor[i]==2){input_i.innerText = answer_now[i];
          }else{input_i.innerText = "×";};
        },i*500);
      };
      setTimeout(function(){
        document.getElementById("opening").style.display = "none";
        document.getElementById("result").style.display = "block";
        if(answer_now=="NIZIU"){document.getElementById("result_text").innerText = "CLEAR!";
        }else{document.getElementById("result_text").innerText = "Failed...";};
        create_reskey();
        document.getElementById("popup").style.display = "block";
      },3600);
    }else if(before==0 && answer_now.length==namelist[selected].length){
      ans_check(answer_now);
      for(let i=0; i<namelist[selected].length; i++){
        let input_i = document.getElementById("input"+selected+"_"+i);
        memo.push(input_i.innerText);
        setTimeout(function(){
          input_i.classList.add("ansturn");
          input_i.style.backgroundColor = anscolor[outcolor[i]+1];
          if(outcolor[i]!=-1){input_i.style.color = "#ffffff";};
        },i*500);
      };
      setTimeout(function(){
        create_square(selected);
        outcolor = [];
        input.style.backgroundColor = "#dddddd";
        if(total(visit)!=9){
          input.innerText = "Choose any color";
        }else{
          input.innerText = "Choose the last color";
          last = 1;
        };
      },(namelist[selected].length)*720);
      before = 1;
      visit[selected] = 1;
    }else if(before==0){
      for(let i=0; i<namelist[selected].length; i++){
        document.getElementById("input"+selected+"_"+i).classList.add("reject");
        setTimeout(function(){document.getElementById("input"+selected+"_"+i).classList.remove("reject")}, 600);
      };
    };
  });

  function shuffle(array){
    array.sort(()=> Math.random()-0.5)
  };

  function create_square(num){
    for(let j=0; j<namelist[num].length; j++){
      var div = document.createElement("div");
      div.classList.add("square1");
      div.setAttribute("id","sq"+(num+1)+"_"+j);
      div.style.backgroundColor = anscolor[outcolor[j]+1];
      if(outcolor[j]!=-1){div.style.color = "#ffffff"};
      div.innerText = memo[j];
      document.getElementById("ans"+(num+1)).appendChild(div);
    };
    memo = [];
  };

  function create_key(){
    for(let j=0; j<2; j++){
      for(let k=0; k<5; k++){
        var div = document.createElement("div");
        div.classList.add("key");
        div.setAttribute("id","key"+(5*j+k));
        document.getElementById("keyboard").appendChild(div);
      };
      for(let k=0; k<5; k++){
        var div = document.createElement("div");  
        div.classList.add("key_num");
        div.textContent = String(5*j+k+1);
        document.getElementById("keyboard").appendChild(div);
      };
    };
  };

  function create_input(num){
    while(input.childNodes.length>0){
      input.removeChild(input.lastChild);
    };
    for(let j=0; j<namelist[num].length; j++){
      var div = document.createElement("div");
      div.classList.add("square2");
      div.setAttribute("id","input"+num+"_"+j);
      document.getElementById("input").appendChild(div);
    };
    answer_now = "";
    before = 0;
    selected = num;
  };

  function ans_check(str){
    let nameparts = [];
    for(let j=0; j<str.length; j++){nameparts.push(namelist[selected][j])};
    for(let j=0; j<str.length; j++){
      if(str[j]==namelist[selected][j]){
        outcolor.push(2);
        var index = nameparts.indexOf(str[j]);
        nameparts.splice(index,1);
      }else if(str[j]=="*"){outcolor.push(-1);
      }else{outcolor.push(0)};
    };
    for(let j=0; j<str.length; j++){
      if(outcolor[j]!=2 && nameparts.indexOf(str[j])!=-1){
        outcolor[j] = 1;
        var index = nameparts.indexOf(str[j]);
        nameparts.splice(index,1);
      };
    };
  };

  function create_result(array){
    for(let j=0; j<5; j++){
      var div = document.createElement("div");
      div.classList.add("square2");
      div.style.backgroundColor = anscolor[outcolor[j]+1];
      if(array[j]==2){
        div.style.color = "#ffffff";
        div.innerText = namelist[9][j];
      };
      document.getElementById("result_box").appendChild(div);
    };
  };

  function create_reskey(){
    for(let j=0; j<2; j++){
      for(let k=0; k<5; k++){
        var div = document.createElement("div");
        div.classList.add("result_key");
        div.textContent = letterlist[0][keyset[5*j+k]]
        document.getElementById("result_keyboard").appendChild(div);
      };
      for(let k=0; k<5; k++){
        var div = document.createElement("div");  
        div.classList.add("key_num");
        div.textContent = String(5*j+k+1);
        document.getElementById("result_keyboard").appendChild(div);
      };
    };
  };
};