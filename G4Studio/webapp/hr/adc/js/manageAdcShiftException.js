/**
 * 考勤管理：处理考勤记录
 * 
 * @author xuyan
 * @since 2015-01-15
 */
Ext
		.onReady(function() {

			var firstStore = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcattendtype.do?reqCode=queryAdcAttendTypeItemsForCombox'
								}),
						reader : new Ext.data.JsonReader({}, [ {
							name : 'type_id'
						}, {
							name : 'type_name'
						} ]),
						baseParams : {
							level : '1'
						}
					});
			firstStore.load();

			var firstCombo = new Ext.form.ComboBox({
				hiddenName : 'first',
				fieldLabel : '选择类型',
				emptyText : '请选择...',
				triggerAction : 'all',
				store : firstStore,
				displayField : 'type_name',
				valueField : 'type_id',
				loadingText : '正在加载数据...',
				mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				forceSelection : true,
				allowBlank : false,
				typeAhead : true,
				resizable : true,
				editable : false,
				labelStyle : micolor,
				anchor : '100%'
			});

			firstCombo.on('select', function() {
				secondCombo.reset();
				var value = firstCombo.getValue();
				secondStore.load({
					params : {
						type_id : value
					}
				});
			});

			var secondStore = new Ext.data.Store(
					{
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcattendtype.do?reqCode=queryAdcAttendTypeItemsForCombox'
								}),
						reader : new Ext.data.JsonReader({}, [ {
							name : 'type_id'
						}, {
							name : 'type_name'
						} ]),
						baseParams : {
							level : '2'
						}
					});

			var secondCombo = new Ext.form.ComboBox({
				name : 'adc_id',
				hiddenName : 'adc_id',
				fieldLabel : '具体原因',
				emptyText : '请选择...',
				triggerAction : 'all',
				store : secondStore,
				displayField : 'type_name',
				valueField : 'type_id',
				loadingText : '正在加载数据...',
				mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				forceSelection : true,
				typeAhead : true,
				allowBlank : false,
				resizable : true,
				editable : false,
				labelStyle : micolor,
				anchor : '100%'
			});

			var addRoot = new Ext.tree.AsyncTreeNode({
				text : root_deptname,
				expanded : true,
				id : root_deptid
			});
			var addDeptTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
					baseAttrs : {},
					dataUrl : '../user.do?reqCode=departmentTreeInit'
				}),
				root : addRoot,
				autoScroll : true,
				animate : false,
				useArrows : false,
				border : false
			});

			// 监听下拉树的节点单击事件
			addDeptTree.on('click', function(node) {
				comboxWithTree.setValue(node.text);
				Ext.getCmp("qForm").findById('deptid').setValue(
						node.attributes.id);
				comboxWithTree.collapse();
			});

			var comboxWithTree = new Ext.form.ComboBox(
					{
						id : 'deptname',
						store : new Ext.data.SimpleStore({
							fields : [],
							data : [ [] ]
						}),
						editable : false,
						allowBlank : false,
						value : '',
						emptyText : '请选择...',
						fieldLabel : '所属部门',
						labelStyle : micolor,
						anchor : '100%',
						mode : 'local',
						triggerAction : 'all',
						maxHeight : 390,
						// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
						tpl : "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
						allowBlank : false,
						onSelect : Ext.emptyFn
					});

			// 监听下拉框的下拉展开事件
			comboxWithTree.on('expand', function() {
				// 将UI树挂到treeDiv容器
				addDeptTree.render('addDeptTreeDiv');
				// addDeptTree.root.expand(); //只是第一次下拉会加载数据
				addDeptTree.root.reload(); // 每次下拉都会加载数据

			});

			var qForm = new Ext.form.FormPanel({
				id : 'qForm',
				border : false,
				labelWidth : 60, // 标签宽度
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				height : 250,
				items : [ comboxWithTree, {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '员工编号',
							name : 'code',
							anchor : '100%'
						}, {
							fieldLabel : '开始时间',
							name : 'start_date',
							xtype : 'datefield', // 设置为数字输入框类型
							format : 'Y-m-d',
							anchor : '100%'
						}, new Ext.form.ComboBox({
							name : 'proc_state',
							hiddenName : 'proc_state',
							fieldLabel : '状态',
							triggerAction : 'all',
							store : PROC_STATEStore,
							displayField : 'text',
							valueField : 'value',
							mode : 'local',
							forceSelection : false, // 选中内容必须为下拉列表的子项
							editable : false,
							typeAhead : true,
							resizable : true,
							allowBlank : false,
							labelStyle : 'color:blue;',
							anchor : '100%'
						}), {
							id : 'deptid',
							name : 'deptid',
							hidden : true
						} ]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : '姓名', // 标签
							id : 'name',
							name : 'name', // name:后台根据此name属性取值
							allowBlank : true, // 是否允许为空
							maxLength : 6, // 可输入的最大文本长度,不区分中英文字符
							anchor : '100%' // 宽度百分比
						}, {
							fieldLabel : '结束时间',
							name : 'end_date',
							xtype : 'datefield', // 设置为数字输入框类型
							format : 'Y-m-d',
							anchor : '100%'
						} ]
					} ]
				} ]
			});

			var qWindow = new Ext.Window({
				title : '<span class="commoncss">查询条件</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 450, // 窗口宽度
				height : 180, // 窗口高度
				closable : false, // 是否可关闭
				closeAction : 'hide', // 关闭策略
				collapsible : true, // 是否可收缩
				maximizable : false, // 设置是否可以最大化
				border : true, // 边框线设置
				constrain : true,
				titleCollapse : true,
				animateTarget : Ext.getBody(),
				pageY : 30, // 页面定位Y坐标
				pageX : document.body.clientWidth / 2 - 400 / 2, // 页面定位X坐标
				// 设置窗口是否可以溢出父容器
				buttonAlign : 'right',
				items : [ qForm ],
				buttons : [
						{
							text : '查询',
							iconCls : 'previewIcon',
							handler : function() {

								queryBalanceInfo(qForm.getForm());
								qWindow.hide();
							}
						}, {
							text : '重置',
							iconCls : 'tbar_synchronizeIcon',
							handler : function() {
								qForm.getForm().reset();
							}
						}, {
							text : '关闭',
							iconCls : 'deleteIcon',
							handler : function() {
								qWindow.hide();
							}
						} ]
			});
			qWindow.show(); // 显示窗口

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

			// 定义列模型
			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel([ rownum, sm, {
				header : '日期',
				dataIndex : 'exception_date',
				//renderer : Ext.util.Format.dateRenderer('Y-m-d'),
				width : 80
			}, {
				header : '部门编码',
				dataIndex : 'deptid',
				hidden : true
			}, {
				header : '部门名称',
				dataIndex : 'deptname',
				width : 160,
				sortable : true
			}, {
				header : '员工编号',
				dataIndex : 'code',
				width : 80,
				sortable : true
			}, {
				header : '姓名',
				dataIndex : 'name',
				width : 80,
				sortable : true
			}, {
				header : '班次',
				dataIndex : 'exception_field',
				width : 80,
				renderer : timeRender,
				sortable : true
			}, {
				header : '应打卡时间',
				dataIndex : 'check_time',
				//renderer : Ext.util.Format.dateRenderer('H:i:s'),
				width : 110
			}, {
				header : '实际打卡时间',
				dataIndex : 'actual_check_time',
				//renderer : Ext.util.Format.dateRenderer('H:i:s'),
				width : 110
			}, {
				header : '状态',
				dataIndex : 'proc_state',
				width : 80,
				renderer : PROC_STATERender
			}, {
				header : '处理类型',
				dataIndex : 'adc_name',
				width : 80
			}, {
				header : '处理说明',
				dataIndex : 'proc_memo',
				width : 160
			}, {
				header : '操作人',
				dataIndex : 'operator_name',
				width : 80,
				sortable : true
			}, {
				header : '操作时间',
				dataIndex : 'operate_time',
				width : 120,
				sortable : true
			}, {
				dataIndex : 'empid',
				hidden : true
			}, {
				dataIndex : 'id',
				hidden : true
			}, {
				dataIndex : 'proc_adc_id',
				hidden : true
			} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store(
					{
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy(
								{
									url : './adcshiftexception.do?reqCode=queryAdcShiftExceptionItemForManage'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT', // 记录总数
							root : 'ROOT' // Json中的列表数据根节点
						}, [ {
							name : 'id' // Json中的属性Key值
						}, {
							name : 'exception_date'
						}, {
							name : 'deptid'
						}, {
							name : 'deptname'
						}, {
							name : 'empid'
						}, {
							name : 'code'
						}, {
							name : 'name'
						}, {
							name : 'sch_id'
						}, {
							name : 'exception_field'
						}, {
							name : 'check_time'
						}, {
							name : 'actual_check_time'
						}, {
							name : 'proc_state'
						}, {
							name : 'operator'
						}, {
							name : 'operator_name'
						}, {
							name : 'operate_time'
						}, {
							name : 'proc_adc_id'
						}, {
							name : 'adc_name'
						}, {
							name : 'proc_memo'
						} ])
					});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = qForm.getForm().getValues();
			});
			// 每页显示条数下拉选择框
			var pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				triggerAction : 'all',
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
				}),
				valueField : 'value',
				displayField : 'text',
				value : '20',
				editable : false,
				width : 85
			});

			// 改变每页显示条数reload数据
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
			var number = parseInt(pagesize_combo.getValue());
			// 分页工具栏
			var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
			});

			// 表格工具栏
			var tbar = new Ext.Toolbar({
				items : [ {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {

						qWindow.show();
					}
				}, {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
					}
				}, '-', {
					text : '处理异常记录',
					iconCls : 'configIcon',
					handler : function() {
						ProcData();
					}
				}, '-', {
					text : '导出Excel',
					iconCls : 'page_excelIcon',
					handler : function() {
						if (store.getCount() > 0) {
							exportExcel('adcshiftexception.do?reqCode=queryAdcShiftExceptionForExcel');

						} else {
							Ext.MessageBox.alert('提示', "当前没有可以导出的数据！！");
						}
					}
				} ]
			});

			// 表格实例
			var grid = new Ext.grid.GridPanel({
				title : '<span class="commoncss">异常考勤记录</span>',
				height : 500,
				autoScroll : true,
				region : 'center',
				margins : '3 3 3 3',
				store : store,
				stripeRows : true,
				frame : true,
				cm : cm,
				sm : sm,
				tbar : tbar,
				bbar : bbar,// 分页工具栏
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});

			// 布局
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ grid ]
			});

			// 查询表格数据
			function queryBalanceInfo(pForm) {
				var params = pForm.getValues();
				params.start = 0;
				params.limit = bbar.pageSize;
				store.load({
					params : params
				});
			}

			var dkztCombo = new Ext.form.ComboBox({
				name : 'proc_state',
				hiddenName : 'proc_state',
				store : PROC_STATEStore,
				mode : 'local',
				// triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '状态',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : "99%"
			});

			function ProcData() {
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要处理的记录!');
					return;
				}

				var strChecked = jsArray2JsString(rows, 'id');
				Ext.getCmp('procDataForm').findById('strChecked').setValue(
						strChecked);
				procDataWindow.show();
			}

			var procDataForm = new Ext.form.FormPanel({
				id : 'procDataForm',
				name : 'procDataForm',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 65,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [ firstCombo, secondCombo, {
					fieldLabel : '说明',
					name : 'proc_memo',
					labelStyle : micolor,
					allowBlank : false,
					anchor : '99%'
				}, {
					id : 'strChecked',
					name : 'strChecked',
					hidden : true
				} ]
			});
			
			
			function timeRender(value){
				if (value == 'work_time'){
					return '上班';
				}else if (value == 'off_time'){
					return '下班';
				}else{
					return value;
				}
			}

			var procDataWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 400,
						height : 250,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						modal : true,
						title : '<span class="commoncss">处理异常记录</span>',
						// iconCls : 'page_addIcon',
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						pageY : 20,
						pageX : document.body.clientWidth / 2 - 420 / 2,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [ procDataForm ],
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

										procDataForm.form
												.submit({
													url : './adcshiftexception.do?reqCode=updateAdcShiftExceptionItem',
													waitTitle : '提示',
													method : 'POST',
													waitMsg : '正在处理数据,请稍候...',
													success : function(form,
															action) {
														procDataWindow.hide();
														store.reload();
														form.reset();
														Ext.MessageBox
																.alert('提示',
																		'数据处理成功！');
													},
													failure : function(form,
															action) {
														var msg = action.result.msg;
														Ext.MessageBox.alert(
																'提示',
																'处理数据失败:<br>'
																		+ msg);
													}
												});

									}
								}, {
									text : '重置',
									id : 'btnReset',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										clearForm(procDataForm.getForm());
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										procDataWindow.hide();
									}
								} ]
					});

		});