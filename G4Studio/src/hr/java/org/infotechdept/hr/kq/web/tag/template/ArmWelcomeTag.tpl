<!-- 由<G4Studio:arm.ArmWelcome/>标签生成的代码开始 -->
<div id="armWelcomeDiv"></div>
<script type="text/javascript">
Ext.onReady(function() {
			new Ext.ux.TipWindow({
						title : '<span class=commoncss>提示</span>',
						html : '您有[0]条未读信息. ',
						iconCls : 'commentsIcon'
					}).show(Ext.getBody());
		});

Ext.onReady(function() {
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

	var tools = [{
				id : 'maximize',
				handler : function(e, target, panel) {
				}
			}];

	var my_height1 = document.body.clientHeight - 35;
	var my_height = document.body.clientHeight - 65;
	
	/**
	 * 徐岩加，下载模板用
	 */
	var my_doc = '<div style="margin:10px">';
	#foreach($file in $fileList)
		my_doc = my_doc + '<a href="./demo/otherDemo.do?reqCode=downloadFile&fileid=' + $file.fileid + '">' + '$file.title' + '</a><br>';	
	#end
	my_doc += '</div>';		
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			xtype : 'portal',
			region : 'center',
			margins : '3 3 3 3',
			items : [{
						columnWidth : .7,
						style : 'padding:8px 0px 8px 8px',
						items : [{
									title : '系统通知',
									layout : 'fit',
									height : 550,
									html:'[2015-01-21]<br>为和OA系统实现互通，考勤信息维护选项发生变化，请注意！'
								}]
					}, {
						columnWidth : .3,
						style : 'padding:8px 8px 8px 8px',
						items : [{
							title : '文档及模板下载 ',
							html : my_doc
						}, {
							title : '联系方式',
							// tools : tools,
							html : '<div style=height:60px;line-height:25px class=commoncss>&nbsp;&nbsp;咨询邮箱: xuyan76@xinglonggroup.com<br>&nbsp;&nbsp;报修RTX：7979</div>'
						}]
					}]
		}]
	});
});
</script>
<!-- 由<G4Studio:arm.ArmWelcome/>标签生成的代码结束 -->