<!-- 由<G4Studio:arm.SelectDkjTree/>标签生成的代码开始 -->
<div id="selectDkjTreeDiv"></div>
<script type="text/javascript">
Ext.onReady(function() {
#foreach($dept in $deptList)
	var node_${dept.deptid} = new Ext.tree.TreeNode({
		text:'${dept.deptname}',	
		id:'id_node_${dept.deptid}'
	});
#end

#foreach($dkj in $dkjList)
	var node_${dkj.dkjid} = new Ext.tree.TreeNode({
		text:'${dkj.dkjmc}',
	#if(${dkj.checked} == "true")
		 checked:true,
	#else
    	checked:false,	
	#end
		dkjid : '${dkj.dkjid}',
		id : 'id_node_${dkj.dkjid}'
	});
#end

#foreach($dept in $deptList)
	#if(${dept.isroot}!="true")
		node_${dept.parentid}.appendChild(node_${dept.deptid});
	#end
#end

#foreach($dkj in $dkjList)
	node_${dkj.deptid}.appendChild(node_${dkj.dkjid});
#end

var selectUserTree = new Ext.tree.TreePanel({
			autoHeight : false,
			autoWidth : false,
			autoScroll : true,
			animate : false,
			rootVisible : true,
			border : false,
			containerScroll : true,
			applyTo : 'selectDkjTreeDiv',
			tbar : [{
				text : '保存',
				id : 'selectUser_saveBtn',
				iconCls : 'acceptIcon',
				handler : function() {
				         if (runMode == '0') {
							Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
							return;
						  }				
					     var checkedNodes = selectUserTree.getChecked();
					     var dkjid = "";
						 for(var i = 0; i < checkedNodes.length; i++) {
						 	var checkNode = checkedNodes[i];
					     	dkjid = dkjid + checkNode.attributes.dkjid + "," ;  
						 }
						 saveUser(dkjid);
				 }
		    }, '-', {
				text : '展开',
				iconCls : 'expand-allIcon',
				handler : function() {
					selectUserTree.expandAll();
				}
		    }, '-', {
				text : '收缩',
				iconCls : 'collapse-allIcon',
				handler : function() {
					selectUserTree.collapseAll();
				}
		    }],
			root : node_${deptid}
  });
  //selectUserTree.expandAll();

node_${deptid}.expand();

//保存授权数据
function saveUser(pUserid){
		showWaitMsg();
		Ext.Ajax.request({
					url : './adcdinnerroom.do?reqCode=saveDinnerRoom',
					success : function(response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
					},
					failure : function(response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
					},
					params : {
						dkjid : pUserid,
						room_id : '$room_id'
					}
				});
}
	
})
</script>
<!-- 由<G4Studio:arm.SelectDkjTree/>标签生成的代码结束 -->