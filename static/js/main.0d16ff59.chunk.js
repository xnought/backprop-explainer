(this.webpackJsonpBackpropagationVisualizer=this.webpackJsonpBackpropagationVisualizer||[]).push([[0],{401:function(t,e,a){},407:function(t,e,a){},412:function(t,e){},413:function(t,e){},421:function(t,e){},424:function(t,e){},425:function(t,e){},426:function(t,e,a){"use strict";a.r(e);var n=a(17),r=a.n(n),s=a(147),i=a.n(s),o=a(62),c=a(19),l=a(2),u=a.n(l),d=a(11),h=a(4),p=a(10),f=a(38),m=a(12),b=a(13),v=a(440),j=a(441),y=a(442),g=a(451),k=a(443),O=a(444),w=a(445),x=a(446),M=a(453),N=a(449),D=a(447),A=a(448),C=(a(401),a(437)),P=a(438),B=a(439),F=a(32),z=function(t){var e=t.playing;return Object(F.jsx)(C.a,{style:{background:e?"#f44336":"#4caf50",color:"#FFFFFF"},children:e?Object(F.jsx)(P.a,{}):Object(F.jsx)(B.a,{})})},L=a(49),T=function(t){Object(m.a)(a,t);var e=Object(b.a)(a);function a(t){var n;return Object(h.a)(this,a),(n=e.call(this,t)).state={},n.initNeuralNetwork=n.initNeuralNetwork.bind(Object(f.a)(n)),n}return Object(p.a)(a,[{key:"initNeuralNetwork",value:function(t){var e=this.props,a=e.playing,n=e.shape,r=e.weights,s=e.slowed,i=t,o=L.e().domain([0,100]).range([50,750]),c=L.e().domain([0,100]).range([500,0]),l={x:34,y:234},u={x:734,y:234},d=L.d().x((function(t){return t.x+16})).y((function(t){return t.y+16})),h=[0,25,50,75,0],p=[],f=[];p.push([l]),f.push(l);for(var m=1;m<n.length-1;m++){for(var b=[],v=0;v<n[m];v++){var j={x:o(h[m])-16,y:c(92-12*v)-16};b.push(j),f.push(j)}p.push(b)}f.push(u),p.push([u]);for(var y=[],g=n.length-1;g>0;g--)for(var k=0;k<n[g-1];k++)for(var O=0;O<n[g];O++)y.push(d({source:p[g-1][k],target:p[g][O]}));var w=this.flatten(r);i.selectAll("path").data(y).enter().append("path").attr("fill","none").attr("class","edgeForward").attr("stroke-width","0.5").attr("d",(function(t){return t})),i.selectAll("path").data(w).attr("stroke-width",(function(t){return Math.pow(t,2)+.2})),i.selectAll("rect").data(f).enter().append("rect").attr("x",(function(t){return t.x})).attr("y",(function(t){return t.y})).attr("width",32).attr("height",32).attr("class","node"),a?a&&i.selectAll("path").attr("class",s?"edgeSlowed":"edgeForward"):i.selectAll("path").attr("class","edgePaused")}},{key:"componentDidMount",value:function(){var t=L.f("#nn").append("svg").attr("width",800).attr("height",500).attr("overflow","visible");this.initNeuralNetwork(t)}},{key:"flatten",value:function(t){for(var e=[],a=0;a<t.length;a++)for(var n=0;n<t[a].length;n++)e.push(t[a][n]);return e}},{key:"revereseFlatten",value:function(t){for(var e=[],a=t.length-1;a>=0;a--)for(var n=0;n<t[a].length;n++)e.push(t[a][n]);return e}},{key:"perNeuron",value:function(t,e){var a=[];if(t.length>0){var n=this.revereseFlatten(t);console.log(n),console.log(t);for(var r=0,s=e.length-1;s>0;s--){for(var i=[],o=0;o<e[s];o++){for(var c=e[s-1],l=[],u=0;u<c;u++)l.push(n[r]),r++;i.push(l)}a.push(i)}}return a.reverse()}},{key:"componentDidUpdate",value:function(){var t=L.f("#nn").select("svg");this.initNeuralNetwork(t)}},{key:"render",value:function(){var t=this.props.children;return Object(F.jsx)("div",{id:"nn",children:t})}}]),a}(n.Component),q=(a(407),function(t){Object(m.a)(a,t);var e=Object(b.a)(a);function a(t){var n;return Object(h.a)(this,a),(n=e.call(this,t)).state={},n}return Object(p.a)(a,[{key:"plotPoints",value:function(t,e){t.selectAll("circle").data(e).enter().append("circle").attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",2).style("fill","#F50257")}},{key:"componentDidMount",value:function(){var t=Object(d.a)(u.a.mark((function t(){var e,a,n,r,s,i,o,c,l,d,h,p;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=this.props,a=e.width,n=e.height,r=e.padding,s=e.start,i=e.stop,e.X,e.y,o=L.f("#nice"),(c=o.append("svg").attr("width",a).attr("height",n).style("overflow","visible")).append("rect").attr("width",a).attr("height",n).attr("class","cord"),l=L.e().domain([s,i]).range([0,a-2*r]),d=L.e().domain([s,i]).range([n-2*r,0]),h=L.a().scale(l),p=L.b().scale(d),c.append("g").attr("class","axis").attr("transform","translate(0,".concat(n-2*r,")")).call(h),c.append("g").attr("class","axis").attr("transform","translate("+(a-2*r)+",0)").call(p),c.append("line").attr("x1",0).attr("y1",(n+1)/2).attr("x2",a).attr("y2",(n+1)/2).attr("class","split"),c.append("line").attr("x1",(a+1)/2).attr("y1",0).attr("x2",(a+1)/2).attr("y2",n).attr("class","split"),c.append("path").attr("id","epic").attr("stroke","none").attr("fill","none");case 13:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(){for(var t=this.props,e=t.width,a=t.height,n=t.padding,r=t.start,s=t.stop,i=t.X,o=t.y,c=t.yhat,l=L.e().domain([r,s]).range([0,e-2*n]),u=L.e().domain([r,s]).range([a-2*n,0]),d=L.f("#nice").select("svg"),h=[],p=0;p<i.length;p++)h.push({x:l(i[p]),y:u(o[p])});for(var f=[],m=0;m<i.length;m++)f.push([l(i[m]),u(c[m])]);d.selectAll("circle").remove(),this.plotPoints(d,h),d.select("#epic").attr("d",L.c()(f)).attr("stroke","black").attr("fill","none")}},{key:"render",value:function(){return Object(F.jsx)("div",{id:"nice"})}}]),a}(n.Component)),S=a(57),X=function(t){Object(m.a)(a,t);var e=Object(b.a)(a);function a(t){var n;return Object(h.a)(this,a),(n=e.call(this,t)).state={X:null,y:null,yhat:[],biasData:[],weightsData:[],data:{X:[],y:[]},model:{seq:{},neurons:[],shape:[1,4,4,1],loss:null,y:null,yhat:[],dlossdyhat:null,epoch:0,lr:.01,curve:"sin",optimizer:"adam",scale:5},controls:{playing:!1,speed:0}},n.main=n.main.bind(Object(f.a)(n)),n.run=n.run.bind(Object(f.a)(n)),n.neuralNetwork=n.neuralNetwork.bind(Object(f.a)(n)),n.initDenseNeuron=n.initDenseNeuron.bind(Object(f.a)(n)),n.initializeModel=n.initializeModel.bind(Object(f.a)(n)),n.linkModel=n.linkModel.bind(Object(f.a)(n)),n.forwardModel=n.forwardModel.bind(Object(f.a)(n)),n.backwardModel=n.backwardModel.bind(Object(f.a)(n)),n.updateModel=n.updateModel.bind(Object(f.a)(n)),n.setInputs=n.setInputs.bind(Object(f.a)(n)),n.generateData=n.generateData.bind(Object(f.a)(n)),n.genTensorData=n.genTensorData.bind(Object(f.a)(n)),n.linearData=n.linearData.bind(Object(f.a)(n)),n.mutate=n.mutate.bind(Object(f.a)(n)),n.mutateModelNeurons=n.mutateModelNeurons.bind(Object(f.a)(n)),n.passBack=n.passBack.bind(Object(f.a)(n)),n.mutateAllBackward=n.mutateAllBackward.bind(Object(f.a)(n)),n.train=n.train.bind(Object(f.a)(n)),n.printParameters=n.printParameters.bind(Object(f.a)(n)),n.reset=n.reset.bind(Object(f.a)(n)),n.asyncPause=n.asyncPause.bind(Object(f.a)(n)),n.resetParameters=n.resetParameters.bind(Object(f.a)(n)),n.changeModelLr=n.changeModelLr.bind(Object(f.a)(n)),n.changeModelOptimizer=n.changeModelOptimizer.bind(Object(f.a)(n)),n}return Object(p.a)(a,[{key:"changeModelOptimizer",value:function(){var t=Object(d.a)(u.a.mark((function t(e){var a;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.modelCompile(e,this.state.model.lr);case 2:a=t.sent,this.mutate("model","seq",a);case 4:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"changeModelLr",value:function(t){var e=this.state.model.seq;e.optimizer_.learningRate=t,this.mutate("model","seq",e)}},{key:"ReLU",value:function(t){return Math.max(0,t)}},{key:"mseDerivative",value:function(t,e){return 2*(t-e)}},{key:"mseLoss",value:function(t,e){return Math.pow(t-e,2)}},{key:"mult",value:function(t,e){return t.map((function(t,a){return t*e[a]}))}},{key:"sum",value:function(t){return t.reduce((function(t,e){return t+e}))}},{key:"getRandomInt",value:function(t){return Math.floor(Math.random()*Math.floor(t))}},{key:"main",value:function(){var t=Object(d.a)(u.a.mark((function t(){var e,a,n,r,s,i;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=function(t){return new Promise((function(e){return setTimeout(e,t)}))};case 1:if(a=this.state,n=a.controls,r=a.model,s=n.playing,i=n.speed,!1!==s){t.next=6;break}return t.abrupt("break",13);case 6:return t.next=8,e(i);case 8:return t.next=10,this.neuralNetwork();case 10:this.mutate("model","epoch",r.epoch+1),t.next=1;break;case 13:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"run",value:function(){var t=Object(d.a)(u.a.mark((function t(){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.mutate("controls","playing",!this.state.controls.playing),t.next=3,this.train(this.state.X,this.state.y);case 3:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"neuralNetwork",value:function(){var t=Object(d.a)(u.a.mark((function t(){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.forwardModel(this.getRandomInt(this.state.data.X.length));case 2:return t.next=4,this.backwardModel();case 4:return t.next=6,this.updateModel();case 6:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"initializeModel",value:function(){var t=Object(d.a)(u.a.mark((function t(e,a,n,r,s){var i,o,l,d,h,p,f,m;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(this.generateData(a,n,r,s),i=[0].concat(Object(c.a)(e)),o=i.length,l=[],d=1;d<o;d++){for(h=[],p=i[d],f=0;f<p;f++)m=this.initDenseNeuron(i[d-1]),h.push(m);l.push(h)}this.mutate("model","neurons",l),this.mutate("model","shape",e);case 7:case"end":return t.stop()}}),t,this)})));return function(e,a,n,r,s){return t.apply(this,arguments)}}()},{key:"initDenseNeuron",value:function(t){for(var e={forward:{inputs:[],weights:[],bias:null,product:[],sum:null,activation:null,output:null},backward:{dvalue:null,dReLU:null,dBias:null,dMult:[],dWeights:[],dInputs:[],dNeuron:null},links:[]},a=0;a<t;a++){var n=.1*(Math.random()<.5?-Math.random():Math.random());e.forward.weights.push(n)}return e.forward.bias=0,e.links=this.linkModel(t),e}},{key:"linkModel",value:function(t){return this.linearData(0,t-1,1)}},{key:"forwardModel",value:function(){var t=Object(d.a)(u.a.mark((function t(e){var a,n,r,s,i,o,c,l,d,h,p,f,m,b,v,j,y,g;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(a=this.state,n=a.data,r=a.model,s=r.neurons,i=r.shape,o=[n.X[e]],this.setInputs(o,0),c=o,l=1;l<i.length;l++)for(this.setInputs(c,l),c=[],d=0;d<i[l];d++)h=s[l][d].forward,p=h.weights,f=h.inputs,m=h.bias,b=this.mult(p,f),v=this.sum(b)+m,l!=i.length-1&&this.ReLU(v),j=v,this.mutateModelNeurons("forward","product",b,l,d),this.mutateModelNeurons("forward","sum",v,l,d),this.mutateModelNeurons("forward","activation",j,l,d),this.mutateModelNeurons("forward","output",j,l,d),c.push(j);y=this.state.model.neurons[i.length-1][0].forward.output,g=this.mseLoss(y,n.y[e]),this.mutate("model","y",n.y[e]),this.mutate("model","yhat",y),this.mutate("model","loss",g);case 11:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"mutateAllBackward",value:function(t,e,a,n,r,s,i,o){this.mutateModelNeurons("backward","dReLU",t,i,o),this.mutateModelNeurons("backward","dBias",e,i,o),this.mutateModelNeurons("backward","dMult",a,i,o),this.mutateModelNeurons("backward","dWeights",n,i,o),this.mutateModelNeurons("backward","dInputs",r,i,o),this.mutateModelNeurons("backward","dNeuron",s,i,o)}},{key:"passBack",value:function(t,e){for(var a=this.state.model.shape,n=e-1,r=0;r<a[n];r++)this.mutateModelNeurons("backward","dvalue",t,n,r)}},{key:"backwardModel",value:function(){var t=Object(d.a)(u.a.mark((function t(){var e,a,n,r,s,i,o,c,l,d,h,p=this;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(e=this.state.model,a=e.yhat,n=e.y,r=e.shape,s=r.length-1,i=this.mseDerivative(a,n),this.mutateModelNeurons("backward","dvalue",i,s,0),o=s;o>0;o--){for(c=[],0,d=function(t){var a=e.neurons[o][t],n=a.backward,r=a.forward,i=r.inputs,l=r.weights,u=r.activation,d=n.dvalue,h=Math.max(0,u)*d,f=h;o==s&&(h=d);var m=i.map((function(){return h})),b=p.mult(i,m),v=p.mult(l,m),j=p.sum(v);p.mutateAllBackward(h,f,m,b,v,j,o,t),c.push(j)},h=0;h<r[o];h++)d(h);l=this.sum(c),this.passBack(l,o)}case 6:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"gradientDescent",value:function(t,e,a){return e-t*a}},{key:"updateModel",value:function(){var t=Object(d.a)(u.a.mark((function t(){var e,a,n,r,s,i,o,c,l,d,h,p,f,m,b;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(e=this.state.model,a=e.shape,n=e.lr,r=e.neurons,s=1;s<a.length;s++)for(i=0;i<a[s];i++){for(o=r[s][i].forward,c=o.weights,l=o.bias,d=r[s][i].backward,h=d.dWeights,p=d.dBias,f=[],m=0;m<a[s-1];m++)f.push(this.gradientDescent(n,c[m],h[m]));b=this.gradientDescent(n,l,p),this.mutateModelNeurons("forward","weights",f,s,i),this.mutateModelNeurons("forward","bias",b,s,i)}case 3:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"setInputs",value:function(t,e){for(var a=this.state.model.neurons,n=0;n<a[e].length;n++)this.mutateModelNeurons("forward","inputs",t,e,n)}},{key:"generateData",value:function(t,e,a,n){if("function"===typeof n&&void 0!==n(t)){var r=this.linearData(t,e,a),s=r.map((function(t){return n(t).toFixed(3)}));this.mutate("data","X",r),this.mutate("data","y",s)}else console.error("Enter a valid equation: must be function with input parameter that returns a number")}},{key:"linearData",value:function(t,e,a){for(var n=[],r=t;r<=e;r+=a)n.push(r);return n}},{key:"mutate",value:function(t,e,a){var n=Object(o.a)({},this.state);t in n&&e in n[t]?(n[t][e]=a,this.setState({state:n})):console.error("Could not be found in state")}},{key:"mutateModelNeurons",value:function(t,e,a,n,r){var s=Object(o.a)({},this.state.model.neurons);void 0!==s[n][r][t][e]?(s[n][r][t][e]=a,this.setState(Object(o.a)(Object(o.a)({},this.state),{},{model:Object(o.a)(Object(o.a)({},this.state.model),{},{neurons:s})}))):console.error("Could not be found in state")}},{key:"predicitons",value:function(){for(var t=this.state.data,e=0;e<t.X.length;e++)this.forwardModel()}},{key:"tensorToArray",value:function(t){return Array.from(t.dataSync())}},{key:"addModel",value:function(){var t=Object(d.a)(u.a.mark((function t(e){var a,n;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(a=this.state.model.shape,e.add(S.b.dense({inputShape:[1],units:a[1],activation:"relu",useBias:!0})),n=2;n<a.length-1;n++)e.add(S.b.dense({units:a[n],activation:"relu",useBias:!0}));return e.add(S.b.dense({units:1,activation:"linear",useBias:!0})),t.abrupt("return",e);case 5:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"modelCompile",value:function(){var t=Object(d.a)(u.a.mark((function t(e,a){var n;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=S.f(),t.next=3,this.addModel(n);case 3:return n.compile({optimizer:e(a),loss:"meanSquaredError"}),t.abrupt("return",n);case 5:case"end":return t.stop()}}),t,this)})));return function(e,a){return t.apply(this,arguments)}}()},{key:"train",value:function(){var t=Object(d.a)(u.a.mark((function t(e,a){var n,r,s,i,o,c,l,d,h;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=this.state.model.seq.model,r=function(t){return new Promise((function(e){return setTimeout(e,t)}))},s=this.state.controls.playing;case 3:if(!1===s){t.next=21;break}if(i=this.state.controls,o=i.playing,c=i.speed,l=this.state.model.epoch,0==(s=o)){t.next=19;break}return this.mutate("model","epoch",l+1),t.next=11,n.fit(e,a,{epochs:1});case 11:return d=t.sent,t.next=14,this.printParameters(n);case 14:return this.mutate("model","loss",d.history.loss[0]),h=n.predict(e),this.mutate("model","yhat",this.tensorToArray(h)),t.next=19,r(c);case 19:t.next=3;break;case 21:case"end":return t.stop()}}),t,this)})));return function(e,a){return t.apply(this,arguments)}}()},{key:"genTensorData",value:function(){var t=Object(d.a)(u.a.mark((function t(e,a){var n,r,s,i,c,l;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,S.e();case 2:n=S.c(-this.state.model.scale,this.state.model.scale,40),r=S.d(e(n),a),s=S.j(n),i=this.tensorToArray(n),c=this.tensorToArray(r),l=this.tensorToArray(s),this.setState(Object(o.a)(Object(o.a)({},this.state),{},{X:n,y:r,data:{X:i,y:c},model:Object(o.a)(Object(o.a)({},this.state.model),{},{yhat:l})}));case 9:case"end":return t.stop()}}),t,this)})));return function(e,a){return t.apply(this,arguments)}}()},{key:"printParameters",value:function(){var t=Object(d.a)(u.a.mark((function t(e){var a,n,r;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(a=[],n=[],r=0;r<e.getWeights().length;r++)(r%2==0?a:n).push(Array.from(e.getWeights()[r].dataSync()));this.setState(Object(o.a)(Object(o.a)({},this.state),{},{biasData:n,weightsData:a}));case 4:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"asyncPause",value:function(){var t=Object(d.a)(u.a.mark((function t(){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.mutate("controls","playing",!1);case 1:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"resetParameters",value:function(){var t=Object(d.a)(u.a.mark((function t(e){var a,n,r;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return"sin"===this.state.model.curve?a=S.g:"tanh"===this.state.model.curve?a=S.h:"cos"===this.state.model.curve&&(a=S.a),"adam"==this.state.model.optimizer?n=S.i.adam:"sgd"==this.state.model.optimizer&&(n=S.i.sgd),t.next=4,this.genTensorData(a,e);case 4:return t.next=6,this.modelCompile(n,this.state.model.lr);case 6:return r=t.sent,t.next=9,this.printParameters(r);case 9:this.setState(Object(o.a)(Object(o.a)({},this.state),{},{model:Object(o.a)(Object(o.a)({},this.state.model),{},{seq:r,epoch:0,loss:null})}));case 10:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"reset",value:function(){var t=Object(d.a)(u.a.mark((function t(e){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.asyncPause();case 2:return t.next=4,this.resetParameters(e);case 4:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){var t=Object(d.a)(u.a.mark((function t(){var e;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.genTensorData(S.g,this.state.model.scale);case 2:return t.next=4,this.modelCompile(S.i.adam,this.state.model.lr);case 4:e=t.sent,this.mutate("model","seq",e),this.printParameters(e);case 7:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"render",value:function(){var t=this,e=this.state,a=e.model,n=e.controls,r=a.epoch,s=a.loss,i=a.shape,o=Object(c.a)(i);o.splice(0,1),o.splice(o.length-1,1);var l=[.001,.01,.1,.3,1..toFixed(1)],h=[{label:"sin",eqn:S.g,scale:5},{label:"cos",eqn:S.a,scale:5},{label:"tanh",eqn:S.h,scale:5}],p=Object(F.jsx)("a",{onClick:Object(d.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.run();case 2:case"end":return e.stop()}}),e)}))),children:Object(F.jsx)(z,{playing:n.playing})});return Object(F.jsxs)("div",{id:"app",children:[Object(F.jsx)(v.a,{position:"static",style:{background:"#f50257",color:"white"},children:Object(F.jsx)(j.a,{children:Object(F.jsx)(y.a,{variant:"h6",children:"Backpropagation Visualizer"})})}),Object(F.jsxs)(g.a,{display:"flex",justifyContent:"center",marginTop:10,children:[Object(F.jsxs)(g.a,{width:400,children:[Object(F.jsx)(k.a,{variant:"outlined",children:Object(F.jsxs)(O.a,{children:[Object(F.jsx)(y.a,{variant:"caption",style:{color:"rgb(245, 2, 87, 0.5)"},children:"Control Center"}),Object(F.jsxs)(y.a,{variant:"h4",children:["Epochs: ",r]}),Object(F.jsxs)(y.a,{variant:"h6",children:["loss: ",null==s?"":s.toFixed(6)]}),Object(F.jsxs)(w.a,{children:[Object(F.jsx)(x.a,{disabled:this.state.controls.playing,onClick:function(){t.reset(a.scale)},children:Object(F.jsx)(D.a,{})}),p,Object(F.jsx)(x.a,{style:{color:0==this.state.controls.speed?"grey":"#FFC006"},onClick:function(){t.mutate("controls","speed",0==t.state.controls.speed?100:0)},children:Object(F.jsx)(A.a,{})})]})]})}),Object(F.jsx)(g.a,{marginTop:5,children:Object(F.jsx)(k.a,{variant:"outlined",children:Object(F.jsxs)(O.a,{children:[Object(F.jsx)(y.a,{variant:"caption",style:{color:"rgb(245, 2, 87, 0.5)"},children:"Model Initialization"}),Object(F.jsxs)(w.a,{children:[Object(F.jsx)(y.a,{variant:"caption",children:"Optimizer"}),["adam","sgd"].map((function(e,n){return Object(F.jsx)(M.a,{disabled:t.state.controls.playing,label:e,color:t.state.model.optimizer==e?"secondary":"default",onClick:function(){t.mutate("model","optimizer",e),t.changeModelOptimizer("sgd"==e?S.i.sgd:S.i.adam),t.reset(a.scale)}},n)}))]}),Object(F.jsxs)(w.a,{children:[Object(F.jsx)(y.a,{variant:"caption",children:"Learning Rate"}),l.map((function(e,a){return Object(F.jsx)(M.a,{label:"".concat(e),color:t.state.model.lr=="".concat(e)?"secondary":"default",onClick:function(){t.mutate("model","lr",e),t.changeModelLr(e)}},a)}))]}),Object(F.jsxs)(w.a,{children:[Object(F.jsx)(y.a,{variant:"caption",children:"Data Set"}),h.map((function(e,n){return Object(F.jsx)(M.a,{disabled:t.state.controls.playing,label:e.label,color:t.state.model.curve==e.label?"secondary":"default",onClick:function(){t.reset(a.scale),t.mutate("model","curve",e.label),t.genTensorData(e.eqn,e.scale)}},n)}))]})]})})})]}),Object(F.jsx)(g.a,{marginLeft:10,children:Object(F.jsx)(T,{weights:this.state.weightsData,biases:this.state.biasData,shape:this.state.model.shape,playing:this.state.controls.playing,slowed:0!=this.state.controls.speed,children:Object(F.jsx)(k.a,{variant:"outlined",style:{minWidth:875},children:Object(F.jsx)(g.a,{justifyContent:"start",display:"flex",children:Object(F.jsxs)(w.a,{children:[Object(F.jsx)(g.a,{marginRight:11.5,children:Object(F.jsx)(N.a,{color:"secondary",onClick:function(){var e=t.state.model.shape;e.length>4||(console.log(e),e.splice(e.length-1),e.push(2),e.push(1),L.f("#app").select("#nn").select("svg").selectAll("path").remove(),L.f("#app").select("#nn").select("svg").selectAll("rect").remove(),t.mutate("model","shape",e),t.reset(5))},children:"Add Layer"})}),o.map((function(e,n){return Object(F.jsxs)(g.a,{marginRight:17,children:[Object(F.jsx)(g.a,{marginBottom:1,children:Object(F.jsx)(M.a,{label:"\u2013",onClick:function(){var e=t.state.model.shape,r=n+1;e[r]=0==e[r]?e[r]:e[r]-1,0==!e[r]&&(L.f("#app").select("#nn").select("svg").selectAll("path").remove(),L.f("#app").select("#nn").select("svg").selectAll("rect").remove(),t.mutate("model","shape",e),t.reset(a.scale))}})}),Object(F.jsx)(g.a,{children:Object(F.jsx)(M.a,{label:"+",onClick:function(){var e=t.state.model.shape,r=n+1;e[r]=e[r]>=8?e[r]:e[r]+1,e[n]<=8&&(L.f("#app").select("#nn").select("svg").selectAll("path").remove(),L.f("#app").select("#nn").select("svg").selectAll("rect").remove(),t.mutate("model","shape",e),t.reset(a.scale))}})})]})})),Object(F.jsx)(g.a,{children:Object(F.jsx)(N.a,{color:"secondary",onClick:function(){var e=t.state.model.shape;e.length>2&&(e.splice(e.length-1),e.splice(e.length-1),e.push(1),L.f("#app").select("#nn").select("svg").selectAll("path").remove(),L.f("#app").select("#nn").select("svg").selectAll("rect").remove(),t.mutate("model","shape",e),t.reset(5))},children:"Remove Layer"})})]})})})})}),Object(F.jsx)(g.a,{marginLeft:10,children:Object(F.jsx)(q,{width:300,height:300,padding:0,start:-this.state.model.scale,stop:this.state.model.scale,X:this.state.data.X,y:this.state.data.y,yhat:this.state.model.yhat})})]})]})}}]),a}(n.Component),I=function(t){t&&t instanceof Function&&a.e(3).then(a.bind(null,455)).then((function(e){var a=e.getCLS,n=e.getFID,r=e.getFCP,s=e.getLCP,i=e.getTTFB;a(t),n(t),r(t),s(t),i(t)}))};i.a.render(Object(F.jsx)(r.a.StrictMode,{children:Object(F.jsx)(X,{})}),document.getElementById("root")),I()}},[[426,1,2]]]);
//# sourceMappingURL=main.0d16ff59.chunk.js.map