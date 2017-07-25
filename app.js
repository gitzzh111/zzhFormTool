(function($, window, document, undefined){

	$.fn.extend({ 
		getInputLabel: function(type){
			// 返回本form表单的input标签
			if(type === "textarea"){
				return $(this).find("textarea")
			}else {
				return $(this).find("input[type='" + type + "']")
			}
		}
		, zzhEcho: function(opt){ // 数据回显
			var options = {
				version: "1.0.0",
				author: "不请自来1991",
				company: "汉艺国际",
				formData: null,	// 表单的数据可以直接传过来，如果传过来的话，就可以不不用发请求了!	
				callback: null, // 回调的函数
				ishasTextarea: false, // 是否有文本域字段，默认为false
				ishasCheckbox: false, // 是否存在多选，默认为false
				ishasRaido: false,	// 是否存在单选按钮
			}
			, _that = $(this);

			// 合并参数
			$.extend(options, opt);
			// 获取input标签 【 text,textarea,radio,checkbox 】
			var $inputs = _that.getInputLabel("text");

			// 判断要不要发送请求: 如果没有，就发送请求
			options.formData === null ? getData(options.requesturl, renderInputValue) : renderInputValue(options.formData);

			// 渲染简单input标签val
			function renderInputValue(data){
				if(!data) return ;
				// 遍历input【简单的input，如果是某个对象下的name属性，还要继续做处理】
				$inputs.each(function(index, ele){
					var _name = $(this).attr("name");
					$(this).val(data[_name])
				});
				// 判断 是否存在文本域 有的话，就继续渲染
				options.ishasTextarea && renderTextareaValue(data)
				// 判断 是否存在单选按钮 有的话，就继续渲染
				options.ishasRaido && renderRadioValue(data)
			}

			function renderTextareaValue (data) {
				var textareas = _that.getInputLabel("textarea")
				textareas.each(function(index, ele){
					var _name = $(this).attr("name")
					$(this).val(data[_name])
				})	
			}

			function renderRadioValue (data) {
				var radios = _that.getInputLabel("radio")
				radios.each(function(index, ele){
					var _name = $(this).attr("name");
					console.log(data[_name])
					if(data[_name] == $(this).val()){
						$(this).attr("checked", true)
					}
				})
			}

			//ajax获取数据
			function getData(dataUrl, fn){
				$.ajax({
					url: dataUrl,
					type: "get",
					dataType:"json",
					success: function(data){
						fn(data.data)
					},
					error: function(data){
						console.log("请求报错，链接:"+ dataUrl +"" + data.responseText)
					}
				})
			}

			return _that;
		}
		, getFormValue2Obj: function () { // 把form表单的值，转为键值对类型 key: value
            var obj = {},
                _that = $(this),
                inputs =_that.find("input[type=text], input[type=radio]:checked, select"),
                select = _that.find("select");
            inputs.each(function (index, ele) {
                obj[$(this).attr("name")] = $(this).val()
            });
            // 暂时不支持多选按钮
            // _that.find("input[type=checkbox]:checked").each(function(index, ele){
            //     console.log($(this))
            // })
            console.log(obj);
            return obj;
        }
		, clearFormVal: function(){ // 清空form表单数据
			var _reset_btn = $(this).find("#form_reset");
			if(_reset_btn.length == 0){
				$(this).append("<p style='display: none'><input type='reset' id='form_reset'></p>");
                _reset_btn = $(this).find("#form_reset");
			}
            _reset_btn.trigger("click");
		}
		, ordinarySearch: function (_url, $id) {
			var select = $(this).find("select"),
				input = $(this).find("input[type=text]"),
				btn = $(this).find("button")
				params = {};

			btn.on("click", function () {
				params[select.val()] = input.val();
				$id.bootstrapTable("refresh", {
                    url: _url,
                    query: params
                });
                params = {};
            })

        }
	});

})(jQuery, window, document)
