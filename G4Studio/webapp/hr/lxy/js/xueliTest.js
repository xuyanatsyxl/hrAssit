/**
 * 表格综合示例(可编辑表格)
 * 
 * @author XiongChun
 * @since 2010-10-20
 */
Ext.onReady(function() {

	
	var SDstore = new Ext.data.SimpleStore({
		fields : [ 'name', 'code' ],
		data : [ [ '小学', '1' ], [ '初中', '2' ],['高中','3'],['大学','4']]
	});
	var SDCombox = new Ext.form.ComboBox({

		emptyText : '--请选择--',
		triggerAction : 'all',
		store : SDstore,
		allowBlank : false,
		displayField : 'name',		
		valueField : 'code',
		mode : 'local',
		listWidth : 120, // 下拉列表的宽度,默认为下拉选择框的宽度
		forceSelection : false,
		typeAhead : true,
		/* value : '0002', */
		resizable : true,
		editable : false,
		anchor : '100%'

	});
	
	var XUELIsm = new Ext.grid.CheckboxSelectionModel();
	// 定义列模型
	var XUELIcm = new Ext.grid.ColumnModel([XUELIsm, {
		dataIndex:'RYID',
		hidden:true	
	},{		
		header : '阶段', // 列标题
		dataIndex : 'SD', // 数据索引:和Store模型对应
		editor : new Ext.grid.GridEditor(SDCombox),
		sortable : true
	// 是否可排序
	}, {
		header : '开始日期',
		dataIndex : 'KSRQ',
		renderer : Ext.util.Format.dateRenderer('Y-m-d'),
		editor : new Ext.grid.GridEditor(new Ext.form.DateField({
			format : 'Y-m-d',
		    allowBlank:false
		})),
		width : 200
	}, {
		header : '结束日期',
		dataIndex : 'JSRQ',
		renderer : Ext.util.Format.dateRenderer('Y-m-d'),
		editor : new Ext.grid.GridEditor(new Ext.form.DateField({
			format : 'Y-m-d',
		    allowBlank:false
			
		}))
	}, {
		header : '毕业学校',
		dataIndex : 'BYYX',
		editor : new Ext.grid.GridEditor(new Ext.form.TextField({
			
			allowBlank:false
		}))
	}, {
		header : '专业',
		dataIndex : 'ZY',
		editor : new Ext.grid.GridEditor(new Ext.form.TextField({
			allowBlank:false
		})),
		width : 60
	}]);

	/**
	 * 数据存储
	 */
	var XUELIstore = new Ext.data.Store({
		// true to clear all modified record information each
		// time the store is loaded
		pruneModifiedRecords : true,
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			//url : 'gridDemo.do?reqCode=querySfxmDatas'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [
		 {
			name:'RYID' 
			 
		 },
		 {
			name : 'SD' // Json中的属性Key值
		}, {
			name : 'KSRQ',
			type : 'date',
			dateFormat : 'Y-m-d'
		}, {
			name : 'JSRQ',
			type : 'date',
			dateFormat : 'Y-m-d'
		}, {
			name : 'BYYX'
		}, {
			name : 'ZY'
		} ])
	});

	// 定义一个Record
	var XUELIRecord = Ext.data.Record.create([ {
		name : 'RYID',
		type : 'int'
	}, {
		name : 'SD',
		type : 'int'
	}, {
		name : 'KSRQ',
		type : 'data'
	}, {
		name : 'JSRQ',
		type : 'data'
	}, {
		name : 'BYYX',
		type : 'string'
	}, {
		name : 'ZY',
		type : 'string'
	}]);

	// 表格工具栏
	var XUELItbar = new Ext.Toolbar({
		items : [  {
			text : '新增一行',
			iconCls : 'addIcon',
			handler : function() {
				var row = new XUELIRecord({});
				//row.set('qybz', '1'); // 赋初值
				XUELIgrid.stopEditing();
				XUELIstore.insert(0, row);
				XUELIgrid.startEditing(0, 1);
			}
		}, {
			text : '保存',
			iconCls : 'acceptIcon',
			handler : function() {
				XUELIsaveRow();
			}
		}, {
			text : '删除一行',
			iconCls : 'deleteIcon',
			handler : function() {
				
				var records = XUELIgrid.getSelectionModel().getSelections();
				
				if (Ext.isEmpty(records)) {
					Ext.Msg.alert('提示', '你没有选中行');
				}
				Ext.each(records,function(record){
					XUELIstore.remove(record);
					
				});
				
			} 
		} ]
	});

	// 表格实例
	var XUELIgrid = new Ext.grid.EditorGridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		title : '<span class="commoncss">表格综合演示三</span>',
		height : 500,
		autoScroll : true,
		frame : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		margins : '3 3 3 3',
		store : XUELIstore, // 数据存储
		stripeRows : true, // 斑马线
		cm : XUELIcm, // 列模型
		sm:XUELIsm,
		tbar : XUELItbar, // 表格工具栏		
		clicksToEdit : 1, // 单击、双击进入编辑状态
		viewConfig : {
			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
			forceFit : true
		},
		loadMask : {
			msg : '正在加载数据,请稍等...'
		}
	});

	

	// 页面初始自动查询数据
	// store.load({params : {start : 0,limit : bbar.pageSize}});

	// 布局模型
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [ XUELIgrid ]
	});
	
	// 保存
	function XUELIsaveRow() {
		var m = XUELIstore.modified.slice(0); // 获取修改过的record数组对象
		if (Ext.isEmpty(m)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
		if (!XUELIvalidateEditGrid(m, 'xmmc')) {
			Ext.Msg.alert('提示', '项目名称字段数据校验不合法,请重新输入!', function() {
				XUELIgrid.startEditing(0, 2);
			});
			return;
		}
		var jsonArray = [];
		// 将record数组对象转换为简单Json数组对象
		Ext.each(m, function(item) {
			jsonArray.push(item.data);
		});
		// 提交到后台处理
		Ext.Ajax.request({
			url : 'gridDemo.do?reqCode=saveDirtyDatas',
			success : function(response) { // 回调函数有1个参数
				var resultArray = Ext.util.JSON.decode(response.responseText);
				Ext.Msg.alert('提示', resultArray.msg);
			},
			failure : function(response) {
				Ext.MessageBox.alert('提示', '数据保存失败');
			},
			params : {
				// 系列化为Json资料格式传入后台处理
				dirtydata : Ext.encode(jsonArray)
			}
		});
	}

	// 检查新增行的可编辑单元格数据合法性
	function XUELIvalidateEditGrid(m, colName) {
		for ( var i = 0; i < m.length; i++) {
			var record = m[i];
			var rowIndex = XUELIstore.indexOfId(record.id);
			var value = record.get(colName);
			if (Ext.isEmpty(value)) {
				// Ext.Msg.alert('提示', '数据校验不合法');
				return false;
			}
			var colIndex = XUELIcm.findColumnIndex(colName);
			var editor = XUELIcm.getCellEditor(colIndex).field;
			if (!editor.validateValue(value)) {
				// Ext.Msg.alert('提示', '数据校验不合法');
				return false;
			}
		}
		return true;
	}

});
