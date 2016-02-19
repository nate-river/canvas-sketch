var sh = angular.module('sketch', []);

sh.controller('shController', ['$scope', function($scope){

	$scope.canvasWH = {width:600,height:600};
	$scope.canvas = document.querySelector('#canvas');
	$scope.ctx = $scope.canvas.getContext('2d');

	$scope.tools = ['line','rect','arc','pen','erase','select'];
	$scope.state = {
		tool:'line',
		fillStyle:'#000',
		strokeStyle:'#000',
		type:'stroke',
		lineWidth:'1',
	}
	$scope.history = [];

	$scope.redrawLastHistory = function (ctx) {
		if( $scope.history.length )
			ctx.putImageData($scope.history[$scope.history.length-1],0,0);	
	}
	$scope.pen = function (ctx,el) {
		ctx.beginPath();
		ctx.moveTo(el.offsetX,el.offsetY);
		$scope.canvas.onmousemove = function(ev){
			ctx.lineTo(ev.offsetX,ev.offsetY);
			ctx.stroke();
		}
	}
	$scope.line = function (ctx,el) {
		$scope.canvas.onmousemove  = function (ev) {
			ctx.clearRect(0,0,600,600);
			$scope.redrawLastHistory(ctx);
			ctx.beginPath();	
			ctx.moveTo(el.offsetX,el.offsetY);
			ctx.lineTo(ev.offsetX,ev.offsetY);	
			ctx.stroke();
		}
	}
	$scope.rect = function (ctx,el) {
		$scope.canvas.onmousemove = function (ev) {
			ctx.clearRect(0,0,600,600);
			$scope.redrawLastHistory(ctx);
			if($scope.state.type=='fill'){
				ctx.fillRect(el.offsetX,el.offsetY,ev.offsetX-el.offsetX,ev.offsetY-el.offsetY);		
			}else{
				ctx.strokeRect(el.offsetX,el.offsetY,ev.offsetX-el.offsetX,ev.offsetY-el.offsetY);		
			}
		}	
	}
	$scope.arc = function (ctx,el) {
		$scope.canvas.onmousemove = function (ev) {
			ctx.clearRect(0,0,600,600);
			$scope.redrawLastHistory(ctx);
			ctx.beginPath();
			ctx.arc(el.offsetX,el.offsetY,Math.abs(ev.offsetX-el.offsetX),0,Math.PI*2);		
			if($scope.state.type == 'fill'){
				ctx.fill();
			}else{
				ctx.stroke();
			}
		}		
	}
	$scope.erase  = function(ctx,el){
		$scope.canvas.onmousemove  = function (ev) {
			ctx.clearRect(ev.offsetX,ev.offsetY,20,20);
		}
	}
	$scope.select = function (ctx,el) {
		$scope.canvas.onmousemove = function (ev) {
			
		}		
	}

	$scope.mousedown = function(el){
		$scope.ctx.fillStyle = $scope.state.fillStyle;
		$scope.ctx.strokeStyle = $scope.state.strokeStyle;
		$scope.ctx.lineWidth  = $scope.state.lineWidth;
		$scope[$scope.state.tool]($scope.ctx,el);
		document.onmouseup = function(){
			canvas.onmouseup = null;
			canvas.onmousemove = null;
			$scope.history.push($scope.ctx.getImageData(0, 0, 600, 600));
		}
	}
	$scope.undo = function(ev){
		ev.stopPropagation();
		$scope.history.pop();	
		$scope.ctx.clearRect(0,0,600,600);
		if($scope.history.length){
			$scope.redrawLastHistory($scope.ctx);
		}else{
			alert('no history');
		}
	}
	$scope.save = function () {
		location.href=($scope.canvas.toDataURL().replace("data:image/png","data:stream/octet"));
	}
	$scope.newCanvas = function () {
		if($scope.history.length){
			if(confirm('是否保存当前图像')){
				$scope.save();
			}
		}
		$scope.ctx.clearRect(0,0,600,600);
		$scope.history = [];
	}
}]);
