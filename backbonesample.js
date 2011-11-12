
(function(namespace){
	myvariable = 100;
	namespace.add = function(first,second){
		return first+second;
	};


})(window.namespace = window.namespace || {});


var value = namespace.add(1,1);
console.log(value);
