/**
 * 报表查询：人员考勤明细表
 * 
 * @author xuyan
 * @since 2015-02-04
 */
Ext
		.onReady(function() {

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
						value : ' ',
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
				height : 120,
				items : [comboxWithTree,  {
					fieldLabel : '输入月份',
					name : 'yearmonth',
					xtype : 'datefield',
					format : 'Ym',
					labelStyle : micolor,
					allowBlank : false,
					anchor : '100%'
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
							fieldLabel : '员工编码',
							name : 'code',
							xtype : 'textfield',
							anchor : '100%'
						}, {
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
							name : 'name', // name:后台根据此name属性取值
							allowBlank : true, // 是否允许为空
							maxLength : 6, // 可输入的最大文本长度,不区分中英文字符
							anchor : '100%' // 宽度百分比
						} ]
					} ]
				} ]
			});

			var qWindow = new Ext.Window({
				title : '<span class="commoncss">查询条件</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 400, // 窗口宽度
				height : 160, // 窗口高度
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
				buttons : [ {
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
			var cm = new Ext.grid.ColumnModel([ rownum, {
				dataIndex : 'id',
				hidden : true
			}, {
				header : '月份',
				dataIndex : 'yearmonth',
				sortable : true
			}, {
				header : '部门编码',
				dataIndex : 'deptid',
				sortable : true
			}, {
				header : '部门名称',
				dataIndex : 'deptname',
				sortable : true
			}, {
				header : 'empid',
				dataIndex : 'empid',
				hidden : true
			}, {
				header : '员工编码',
				dataIndex : 'code',
				sortable : true
			}, {
				header : '姓名',
				dataIndex : 'name',
				sortable : true
			}, {
				header : '出勤天数',
				dataIndex : 'actual_work_days',
				sortable : true
			}, {
				header : '公休日',
				dataIndex : 'rest_days',
				sortable : true
			}, {
				header : '病假',
				dataIndex : 'sick_leave_days',
				sortable : true
			}, {
				header : '事假',
				dataIndex : 'personal_leave_days',
				sortable : true
			}, {
				header : '旷工',
				dataIndex : 'absenteeism_days',
				sortable : true
			}, {
				header : '点假',
				dataIndex : 'hour_leave_hours',
				sortable : true
			}, {
				header : '婚丧',
				dataIndex : 'funeral_leave_days',
				sortable : true
			}, {
				header : '护理假',
				dataIndex : 'care_days',
				sortable : true
			}, {
				header : '计生假',
				dataIndex : 'birth_control_days',
				sortable : true
			}, {
				header : '工伤假',
				dataIndex : 'injury_leave_days',
				sortable : true
			}, {
				header : '宿休',
				dataIndex : 'night_shift_leave_days',
				sortable : true
			}, {
				header : '公出',
				dataIndex : 'official_away_days',
				sortable : true
			}, {
				header : '年假',
				dataIndex : 'annual_leave_days',
				sortable : true
			}, {
				header : '值班',
				dataIndex : 'duty_days',
				sortable : true
			}, {
				header : '值宿',
				dataIndex : 'night_shift_days',
				sortable : true
			}, {
				header : '节日',
				dataIndex : 'holiday_days',
				sortable : true
			}, {
				header : '加班小时',
				dataIndex : 'overtime_hours',
				sortable : true
			}, {
				header : '备注',
				dataIndex : 'remark'
			} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store(
					{
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy(
								{
									url : 'adcreport.do?reqCode=queryAdcReportPersonMonthForManage'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT', // 记录总数
							root : 'ROOT' // Json中的列表数据根节点
						}, [ {
							name : 'id' // Json中的属性Key值
						}, {
							name : 'yearmonth'
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
							name : 'work_days'
						}, {
							name : 'notwork_days'
						}, {
							name : 'actual_work_days'
						}, {
							name : 'rest_days'
						}, {
							name : 'sick_leave_days'
						}, {
							name : 'personal_leave_days'
						}, {
							name : 'absenteeism_days'
						}, {
							name : 'hour_leave_hours'
						}, {
							name : 'funeral_leave_days'
						}, {
							name : 'duty_days'
						}, {
							name : 'care_days'
						}, {
							name : 'birth_control_days'
						}, {
							name : 'injury_leave_days'
						}, {
							name : 'night_shift_leave_days'
						}, {
							name : 'official_away_days'
						}, {
							name : 'annual_leave_days'
						}, {
							name : 'night_shift_days'
						}, {
							name : 'holiday_days'
						}, {
							name : 'overtime_hours'
						}, {
							name : 'remark'
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
				}, {
					text : '导出',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
					}
				}, {
					text : '打印考勤表',
					iconCls : 'printerIcon',
					handler : function(){
						printCatalog();						
					}
				} ]
			});

			// 表格实例
			var grid = new Ext.grid.GridPanel({
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				margins : '3 3 3 3',
				// collapsible : true,
				border : true,
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">部门月份考勤明细</span>',
				// height : 500,
				autoScroll : true,
				frame : true,
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				tbar : tbar,
				bbar : bbar,// 分页工具栏
				viewConfig : {
					// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
					forceFit : false
				},
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
			
			/**
			 * 打印
			 */
			function printCatalog() {
				showWaitMsg('正在准备报表数据,请稍等...');
				Ext.Ajax.request({
							url : 'adcreport.do?reqCode=buildReportDataObject',
							success : function(response) {
								hideWaitMsg();
								doExport('adcShiftReportMonth');
								//doHtmlExport('adcShiftReportMonth');
							},
							failure : function(response) {
								hideWaitMsg();
								Ext.Msg.alert('提示', "准备报表数据对象发生错误,请检查!");
							}
						});
			}

		});