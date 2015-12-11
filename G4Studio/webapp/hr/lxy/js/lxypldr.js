Ext.onReady(function() {

	var batchform = new Ext.form.FormPanel({
		id : 'batchform',
		name : 'batchform',
		frame : true,
		region : 'north',
		fileUpload : true,
		labelAlign : 'right',
		buttonAlign : 'center',
		height : 100,
		bodyStyle : 'padding:10 100 10 50', // 表单元素和表单面板的边距
		labelWidth : 99,
		items : [ {
			fieldLabel : '选择文件',
			id : 'batchFormFile',
			name : 'file2', // 必须为file1/file2/file3/file4/file5.目前Web标准上传模式支持最多5个文件的批量上传
			xtype : 'fileuploadfield', // 上传字段
			allowBlank : false,
			anchor : '100%'
		} ]

		,
		buttons : [ {
			text : '导入',
			iconCls : 'acceptIcon',
			handler : function() {
				savabatch();
			}
		} ]
	});

	var memo = new Ext.form.TextArea({
		id : 'memo',
		margins : '3 3 3 3',
		readOnly : true,
		region : 'center'
	});
	
	function savabatch() {

		memo.reset();
		
		var theFile = Ext.getCmp('batchFormFile').getValue();
		if (Ext.isEmpty(theFile)) {
			Ext.Msg.alert('提示', '请先选择您要导入的xls文件...');
			return;
		}
		if (theFile.substring(theFile.length - 4, theFile.length) != ".xls") {
			Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件!');
			return;
		}
		batchform.form.submit({
			url : './lxy.do?reqCode=saveLxybmsqbBatch',
			waitTitle : '提示',
			method : 'POST',
			waitMsg : '正在处理数据,请稍候...',
			success : function(form, action) {
				memo.setValue(action.result.msg);
			},
			failure : function(form, action) {
				var msg = action.result.msg;
				memo.setValue(msg);
			}
		});

	}

	// 布局
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [ batchform,  memo]
	});

});