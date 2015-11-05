/**
 * 月末报表生成
 * 
 * @author xuyan
 * @since 2015-02-06
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
		Ext.getCmp("qForm").findById('deptid')
				.setValue(node.attributes.id);
		comboxWithTree.collapse();
	});
			var comboxWithTree = new Ext.form.ComboBox({
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
				height : 140,
				items : [ comboxWithTree, {
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
						items : [ ]
					} ]
				} ]
			});

			var qWindow = new Ext.Window({
				title : '<span class="commoncss">生成月末考勤报表</span>', // 窗口标题
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
					text : '生成',
					iconCls : 'previewIcon',
					handler : function() {
						makeReport();
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
			
			/**
			 * 报表生成事件
			 */
			function makeReport(){
				var deptid = Ext.getCmp('deptid').getValue();
				if (Ext.isEmpty(deptid)){
					Ext.Msg.alert('提示', '必须选择部门');
					return;
				}
				
				if (!qForm.form.isValid()){
					return;
				}
				var params = qForm.getForm().getValues();
				showWaitMsg();
				
				qForm.form.submit({
					url : './adcshiftreport.do?reqCode=makeAdcShiftReport',
					success : function(form, action) {
						Ext.Msg.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						Ext.Msg.alert('提示', '数据保存失败,原因:' + action.result.msg);
					},
					params : params
				});
				
			}

		});