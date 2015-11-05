/**
 * 节假日管理
 * 
 * @author xuyan
 * @since 2015-02-02
 */
Ext
		.onReady(function() {
			
			// 定义一个Record
			var MyRecord = Ext.data.Record.create([{
						name : 'id',
						type : 'string'
					}, {
						name : 'h_code',
						type : 'string'
					}, {
						name : 'h_date',
						type : 'string'
					}, {
						name : 'adc_id',
						type : 'string'
					}, {
						name : 'adc_name',
						type : 'string'
					}, {
						name : 'string_date',
						type : 'string'
					}]);
			
			var store_adc = new Ext.data.SimpleStore({
				fields : ['text', 'value'],
				data : [['[0201]周休', '0201'], ['[0202]节休', '0202']]
			});			

			var cm_detail = new Ext.grid.ColumnModel([
					new Ext.grid.RowNumberer(), {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '日期',
						dataIndex : 'h_date',
						renderer : Ext.util.Format.dateRenderer('Y-m-d'),
						width : 100
					}, {
						header : '串哪天',
						dataIndex : 'string_date',
						editor : new Ext.grid.GridEditor(new Ext.form.DateField({
							format : 'Y-m-d'
						})),
						renderer : Ext.util.Format.dateRenderer('Y-m-d'),
						width : 100
					}, {
						header : '出勤状态',
						dataIndex : 'adc_id',
						editor : new Ext.grid.GridEditor(new Ext.form.ComboBox({
							store : store_adc,
							mode : 'local',
							triggerAction : 'all',
							valueField : 'value',
							displayField : 'text',
							allowBlank : false,
							forceSelection : true,
							typeAhead : true
						})),
						width : 120
					}]);

			var store_detail = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './holiday.do?reqCode=queryAdcHolidayDetailItemForManage'
								}),
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, [ {
							name : 'id'
						}, {
							name : 'h_code'
						}, {
							name : 'h_date'
						}, {
							name : 'string_date'
						}, {
							name : 'adc_id'
						}, {
							name : 'adc_name'
						} ])
					});

			var pagesize_combo_detail = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
				}),
				valueField : 'value',
				displayField : 'text',
				value : '50',
				editable : false,
				width : 85
			});

			var number_detail = parseInt(pagesize_combo_detail.getValue());
			pagesize_combo_detail.on("select", function(comboBox) {
				bbar_detail.pageSize = parseInt(comboBox.getValue());
				number_detail = parseInt(comboBox.getValue());
				store_detail.reload({
					params : {
						start : 0,
						limit : bbar_detail.pageSize
					}
				});
			});

			var bbar_detail = new Ext.PagingToolbar({
				pageSize : number_detail,
				store : store_detail,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo_detail ]
			});
			
			var grid_detail = new Ext.grid.EditorGridPanel({
				title : '<span class="commoncss">节日列表</span>',
				height : 500,
				// width:600,
				autoScroll : true,
				region : 'center',
				margins : '3 3 3 3',
				store : store_detail,
				clicksToEdit : 1,
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				viewConfig : {
					// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
					forceFit : true
				},
				stripeRows : true,
				cm : cm_detail,
				bbar : bbar_detail
			});
			
			var addAdcHolidayPanel = new Ext.form.FormPanel({
				id : 'addAdcHolidayPanel',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 3 3', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				region : 'north',
				height : 80,
				items : [{
					fieldLabel : '节日名称',
					name : 'h_name',
					xtype : 'textfield',
					anchor : '99%'
				}, {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '开始日期',
							id : 'start_date',
							name : 'start_date',
							xtype : 'datefield',
							format : 'Y-m-d',
							anchor : '99%'
						}, {
							id : 'windowmode',
							name : 'windowmode',
							hidden : true
						}, {
							id : 'h_code',
							name : 'h_code',
							hidden : true
						}]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
							fieldLabel : '结束日期',
							id : 'end_date',
							name : 'end_date',
							xtype : 'datefield',
							format : 'Y-m-d',
							anchor : '99%',
							listeners : {
								'select' : function(value){
									var startDate = new Date(Ext.getCmp('start_date').getValue());
									var endDate = new Date(Ext.getCmp('end_date').getValue());
									var tmpDate = startDate;
									var i = 0;
									while (tmpDate <= endDate){
										var rec = new MyRecord();
										rec.set('h_date', tmpDate);
										store_detail.insert(i, rec);
										i++;
										tmpDate = tmpDate.add(Date.DAY, 1);
									}
									
								}
							}
						}, {
							id : 'dirtydata',
							name : 'dirtydata',
							hidden : true
						}]
					} ]
				} ]
			});

			var addAdcHolidayWindow = new Ext.Window(
					{
						layout : 'border',
						width : 500,
						height : 500,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">新增节日</span>',
						// iconCls : 'page_addIcon',
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						pageY : 20,
						pageX : document.body.clientWidth / 2 - 820 / 2,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [ addAdcHolidayPanel, grid_detail],
						buttons : [
								{
									text : '保存',
									iconCls : 'acceptIcon',
									handler : function() {
										if (runMode == '0') {
											Ext.Msg
													.alert('提示',
															'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
											return;
										}
										saveAdcHolidayItem();
									}
								},
								 {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										addAdcHolidayWindow.hide();
									}
								} ]
					});

			
			
			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm,
					{
						header : '节日编号',
						dataIndex : 'h_code',
						sortable : true,
						width : 80
					}, {
						header : '节日名称',
						dataIndex : 'h_name',
						sortable : true,
						width : 200
					}, {
						header : '开始日期',
						dataIndex : 'start_date',
						sortable : true,
						width : 120
					}, {
						header : '结束日期',
						dataIndex : 'end_date',
						sortable : true,
						width : 120
					}, {
						header : '备注',
						dataIndex : 'remark',
						id : 'remark'
					} ]);

			var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './holiday.do?reqCode=queryAdcHolidayItems'
				}),
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'h_code'
				}, {
					name : 'h_name'
				}, {
					name : 'start_date'
				}, {
					name : 'end_date'
				}, {
					name : 'remark'
				} ])
			});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = {
					queryParam : Ext.getCmp('queryParam').getValue()
				};
			});

			var pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
				}),
				valueField : 'value',
				displayField : 'text',
				value : '50',
				editable : false,
				width : 85
			});
			var number = parseInt(pagesize_combo.getValue());
			pagesize_combo.on("select", function(comboBox) {
				bbar.pageSize = parseInt(comboBox.getValue());
				number = parseInt(comboBox.getValue());
				store.reload({
					params : {
						start : 0,
						limit : bbar.pageSize
					}
				});
			});

			var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
			});

			var grid = new Ext.grid.GridPanel({
				title : '<span class="commoncss">节日列表</span>',
				height : 510,
				store : store,
				region : 'center',
				margins : '3 3 3 3',
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				autoExpandColumn : 'remark',
				cm : cm,
				sm : sm,
				tbar : [ {
					text : '新增',
					iconCls : 'page_addIcon',
					handler : function() {
						addInit();
					}
				}, '-', {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						editInit();
					}
				}, '-', {
					text : '删除',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteAdcHolidayItems();
					}
				} , '->', new Ext.form.TextField({
					id : 'queryParam',
					name : 'queryParam',
					emptyText : '字段|字段名|代码描述',
					enableKeyEvents : true,
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								queryCodeItem();
							}
						}
					},
					width : 130
				}), {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						queryCodeItem();
					}
				}, '-', {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
					}
				} ],
				bbar : bbar
			});
			store.load({
				params : {
					start : 0,
					limit : bbar.pageSize
				}
			});

			grid.addListener('rowdblclick', editInit);
			grid.on('sortchange', function() {
				// grid.getSelectionModel().selectFirstRow();
			});

			bbar.on("change", function() {
				// grid.getSelectionModel().selectFirstRow();
			});
	

			/**
			 * 布局
			 */
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ grid ]
			});
			
			/**
			 * 编辑初始化
			 */
			function editInit(){
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要修改的项目!');
					return;
				}

				addAdcHolidayPanel.getForm().loadRecord(record);
				var h_code = record.get('h_code');
				store_detail.load({
					params : {
						h_code : h_code,
						start : 0,
						limit : bbar_detail.pageSize
					}
				});
				addAdcHolidayWindow.show();
				addAdcHolidayWindow.setTitle('<span class="commoncss">修改节日信息</span>');
				Ext.getCmp('windowmode').setValue('edit');
				Ext.getCmp('h_code').setValue(h_code);				
			}
			
			/**
			 * 新增初始化
			 */
			function addInit() {
				var flag = Ext.getCmp('windowmode').getValue();
				if (typeof(flag) != 'undefined') {
					addAdcHolidayPanel.form.getEl().dom.reset();
				} else {
					clearForm(addAdcHolidayPanel.getForm());
				}
				addAdcHolidayWindow.show();
				addAdcHolidayWindow.setTitle('<span class="commoncss">新增节日信息</span>');
				Ext.getCmp('windowmode').setValue('add');
			}

			/**
			 * 保存节日信息
			 */
			function saveAdcHolidayItem(){
				if (!addAdcHolidayPanel.form.isValid()){
					return;
				}
				
				if (store_detail.getCount() == 0){
					Ext.Msg.alert('提示', '没有需要保存的记录！');
					return;
				}
				
				var jsonArray = [];
				store_detail.each(function(record){
					if (record.get('adc_id') == ''){
						Ext.Msg.alert('提示', '必须选择出勤类型！');
						return;
					}
					jsonArray.push(record.data);
				});
				Ext.getCmp('dirtydata').setValue(Ext.encode(jsonArray));
				
				var mode = Ext.getCmp('windowmode').getValue();
				if (mode == 'add'){
					save();
				}else{
					update();
				}
			}

			function save(){
				showWaitMsg();			
				addAdcHolidayPanel.form.submit({
					url : './holiday.do?reqCode=saveAdcHolidayItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcHolidayWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '节日数据保存失败:<br>' + msg);
					}					
				});
			}
			
			function update(){
				showWaitMsg();			
				addAdcHolidayPanel.form.submit({
					url : './holiday.do?reqCode=updateAdcHolidayItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						addAdcHolidayWindow.hide();
						store.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '节日数据保存失败:<br>' + msg);
					}					
				});
			}
			/**
			 * 删除代码对照
			 */
			function deleteAdcHolidayItems() {
				if (runMode == '0') {
					Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
					return;
				}
				var rows = grid.getSelectionModel().getSelections();

				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'h_code');
				Ext.Msg.confirm('请确认', '你真的要删除节日吗?', function(btn, text) {
					if (btn == 'yes') {
						showWaitMsg();
						Ext.Ajax.request({
							url : './holiday.do?reqCode=deleteAdcHolidayItem',
							success : function(response) {
								store.reload();
								Ext.Msg.alert('提示', '删除成功！');
							},
							failure : function(response) {
								var resultArray = Ext.util.JSON.decode(response.responseText);
								Ext.Msg.alert('提示', resultArray.msg);
							},
							params : {
								strChecked : strChecked
							}
						});
					}
				});
			}

			/**
			 * 根据条件查询字典
			 */
			function queryCodeItem() {
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						queryParam : Ext.getCmp('queryParam').getValue()
					}
				});
			}

			/**
			 * 刷新字典
			 */
			function refreshCodeTable() {
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize
					}
				});
			}
		});