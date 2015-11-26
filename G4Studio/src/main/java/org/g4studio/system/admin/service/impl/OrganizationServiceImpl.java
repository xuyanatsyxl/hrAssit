package org.g4studio.system.admin.service.impl;

import java.util.List;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.json.JsonHelper;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;
import org.g4studio.system.common.util.SystemConstants;
import org.g4studio.system.common.util.idgenerator.IdGenerator;

/**
 * 组织机构模型业务实现类
 * 
 * @author XiongChun
 * @since 2010-01-13
 */
public class OrganizationServiceImpl extends BaseServiceImpl implements OrganizationService {

	/**
	 * 获取用户信息
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto getUserInfo(Dto pDto) {
		Dto outDto = new BaseDto();
		pDto.put("lock", SystemConstants.LOCK_N);
		pDto.put("enabled", SystemConstants.ENABLED_Y);
		UserInfoVo userInfo = (UserInfoVo) g4Dao.queryForObject("Organization.getUserInfo", pDto);
		outDto.put("userInfo", userInfo);
		return outDto;
	}

	/**
	 * 查询部门信息生成部门树
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto queryDeptItems(Dto pDto) {
		Dto outDto = new BaseDto();
		List deptList = g4Dao.queryForList("Organization.queryDeptItemsByDto", pDto);
		Dto deptDto = new BaseDto();
		for (int i = 0; i < deptList.size(); i++) {
			deptDto = (BaseDto) deptList.get(i);
			if (deptDto.getAsString("leaf").equals(SystemConstants.LEAF_Y))
				deptDto.put("leaf", new Boolean(true));
			else
				deptDto.put("leaf", new Boolean(false));
			if (deptDto.getAsString("id").length() == 6)
				deptDto.put("expanded", new Boolean(true));
		}
		outDto.put("jsonString", JsonHelper.encodeObject2Json(deptList));
		return outDto;
	}

	/**
	 * 保存部门
	 * 
	 * @param pDto
	 * @return
	 */
	public synchronized Dto saveDeptItem(Dto pDto) {
		String deptid = IdGenerator.getDeptIdGenerator(pDto.getAsInteger("parentid"));
		pDto.put("cascadeid", deptid);
		pDto.put("leaf", SystemConstants.LEAF_Y);
		// MYSQL下int类型字段不能插入空字符
		pDto.put("sortno",
				G4Utils.isEmpty(pDto.getAsString("sortno")) ? Integer.valueOf("0") : pDto.getAsString("sortno"));
		pDto.put("enabled", SystemConstants.ENABLED_Y);
		g4Dao.insert("Organization.saveDeptItem", pDto);
		Dto updateDto = new BaseDto();
		updateDto.put("deptid", pDto.getAsString("parentid"));
		updateDto.put("leaf", SystemConstants.LEAF_N);
		g4Dao.update("Organization.updateLeafFieldInEaDept", updateDto);
		return null;
	}

	/**
	 * 修改部门
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto updateDeptItem(Dto pDto) {
		if (G4Utils.isEmpty(pDto.getAsString("sortno"))) {
			pDto.put("sortno", "0");
		}
		if (pDto.getAsString("parentid").equals(pDto.getAsString("parentid_old"))) {
			pDto.remove("parentid");
			g4Dao.update("Organization.updateDeptItem", pDto);
		} else {
			g4Dao.update("Organization.updateEadeptItem", pDto);
			saveDeptItem(pDto);
			pDto.put("parentid", pDto.getAsString("parentid_old"));
			updateLeafOfDeletedParent(pDto);
		}
		return null;
	}

	/**
	 * 调整被删除部门的直系父级部门的Leaf属性
	 * 
	 * @param pDto
	 */
	private void updateLeafOfDeletedParent(Dto pDto) {
		String parentid = pDto.getAsString("parentid");
		pDto.put("deptid", parentid);
		Integer countInteger = (Integer) g4Dao.queryForObject("Organization.prepareChangeLeafOfDeletedParentForEadept", pDto);
		if (countInteger.intValue() == 0) {
			pDto.put("leaf", SystemConstants.LEAF_Y);
		} else {
			pDto.put("leaf", SystemConstants.LEAF_N);
		}
		g4Dao.update("Organization.updateLeafFieldInEaDept", pDto);
	}

	/**
	 * 删除部门项
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto deleteDeptItems(Dto pDto) {
		Dto dto = new BaseDto();
		if (pDto.getAsString("type").equals("1")) {
			// 列表复选删除
			String[] arrChecked = pDto.getAsString("strChecked").split(",");
			for (int i = 0; i < arrChecked.length; i++) {
				dto.put("deptid", arrChecked[i]);
				dto.put("cascadeid", queryCascadeidByDeptid(Integer.valueOf(arrChecked[i])));
				deleteDept(dto);
			}
		} else {
			// 部门树右键删除
			String cascadeid = queryCascadeidByDeptid(pDto.getAsInteger("deptid"));
			dto.put("cascadeid", cascadeid);
			dto.put("deptid", pDto.getAsInteger("deptid"));
			deleteDept(dto);
		}
		return null;
	}

	/**
	 * 删除部门 类内部调用
	 * 
	 * @param pDto
	 */
	private void deleteDept(Dto pDto) {
		Dto changeLeafDto = new BaseDto();
		Dto tempDto = (BaseDto) g4Dao.queryForObject("Organization.queryDeptItemsByDto", pDto);
		if (G4Utils.isNotEmpty(tempDto)) {
			changeLeafDto.put("parentid", tempDto.getAsString("parentid"));
		}
		g4Dao.delete("Organization.deleteEaroleAuthorizeInDeptManage", pDto);
		g4Dao.delete("Organization.deleteEaroleInDeptManage", pDto);
		g4Dao.delete("Organization.deleteEauserauthorizeInDeptManage", pDto);
		g4Dao.delete("Organization.deleteEauserauthorizeInDeptManage2", pDto);
		g4Dao.delete("Organization.deleteEausermenumapInDeptManage", pDto);
		g4Dao.delete("Organization.deleteEausersubinfoInDeptManage", pDto);
		g4Dao.delete("Organization.deleteEausermenumapInDeptManage", pDto);
		g4Dao.delete("Organization.deleteEarolemenumapInDeptManage", pDto);
		g4Dao.update("Organization.updateEauserInDeptManage", pDto);
		g4Dao.update("Organization.updateEadeptItem", pDto);
		if (G4Utils.isNotEmpty(tempDto)) {
			updateLeafOfDeletedParent(changeLeafDto);
		}
	}

	/**
	 * 根据用户所属部门编号查询部门对象<br>
	 * 用于构造组织机构树的根节点
	 * 
	 * @param
	 * @return
	 */
	public Dto queryDeptinfoByDeptid(Dto pDto) {
		Dto outDto = new BaseDto();
		outDto.putAll((BaseDto) g4Dao.queryForObject("Organization.queryDeptinfoByDeptid", pDto));
		outDto.put("success", new Boolean(true));
		return outDto;
	}

	/**
	 * 保存用户主题信息
	 * 
	 * @param pDto
	 */
	public Dto saveUserTheme(Dto pDto) {
		Dto outDto = new BaseDto();
		g4Dao.update("Organization.saveUserTheme", pDto);
		outDto.put("success", new Boolean(true));
		return outDto;
	}
	
	/**
	 * 保存用户布局信息
	 * 
	 * @param pDto
	 */
	public Dto saveUserLayout(Dto pDto) {
		Dto outDto = new BaseDto();
		g4Dao.update("Organization.saveUserLayout", pDto);
		outDto.put("success", new Boolean(true));
		return outDto;
	}
	
	/**
	 * 保存用户自定义桌面背景
	 * 
	 * @param pDto
	 */
	public Dto saveUserBackground(Dto pDto) {
		Dto outDto = new BaseDto();
		g4Dao.update("Organization.saveUserBackground", pDto);
		outDto.put("success", new Boolean(true));
		return outDto;
	}

	/**
	 * 调整父部门
	 */
	public Dto adjustParentDept(Dto pDto) {
		//先要检查调整后的部门是否是该部门或是该部门的下级部门
		Dto outDto = new BaseDto();
		Dto inDto = new BaseDto();
		inDto.put("deptid", pDto.getAsString("parentid"));	
		List<Dto> depts = g4Dao.queryForList("Organization.queryDeptItemsForManage", inDto);
		
		Dto newParentDept = depts.get(0);
		String parentCasId = newParentDept.getAsString("cascadeid");
		
		String cascadeid_old = pDto.getAsString("cascadeid");
		if (parentCasId.startsWith(cascadeid_old)){
			outDto.put("success", false);
			outDto.put("msg", "不能调整父部门为自身部门或自身子部门！");
			return outDto;
		}
		
		//先更新自己信息
		Dto updateDto = new BaseDto();
		updateDto.put("deptid", pDto.getAsString("deptid"));
		updateDto.put("parentid", pDto.getAsString("parentid"));
		updateDto.put("cascadeid", IdGenerator.getDeptIdGenerator(newParentDept.getAsInteger("deptid")));
		g4Dao.update("Organization.updateDeptItem", updateDto);
		updateDto.clear();
		updateDto.put("deptid", pDto.getAsString("parentid"));
		updateDto.put("leaf", SystemConstants.LEAF_N);
		g4Dao.update("Organization.updateLeafFieldInEaDept", updateDto);
		
		//把子部门的信息取出来，更新cascadeid
		inDto.clear();
		inDto.put("cascadeid", pDto.getAsString("cascadeid"));
		List<Dto> deptDto = g4Dao.queryForList("Organization.queryDeptItemsForManage", inDto);
		for(Dto d : deptDto){
			d.put("cascadeid", IdGenerator.getDeptIdGenerator(d.getAsInteger("parentid")));
			g4Dao.update("Organization.updateDeptItem", d);
		}
		outDto.put("success", true);
		outDto.put("msg", "隶属关系调整成功！");
		return outDto;
	}

	/**
	 * 合并部门
	 * 只能针对末级和末级合并
	 */
	public Dto saveMergeDept(Dto pDto) {
		Dto outDto = new BaseDto();
		outDto.put("success", new Boolean(false));
		outDto.put("message", "还未开放！");
		return outDto;
	}

	/**
	 * 根据DEPTID查询CASCADEID
	 */
	public String queryCascadeidByDeptid(Integer deptid) {
		String cascadeid = (String)g4Dao.queryForObject("Organization.queryCascadeidByDeptid", deptid);
		return cascadeid;
	}
	
	/**
	 * 根据cascadeid查询deptid
	 */
	public Integer queryDeptidByCascadeid(String cascadeid) {
		Integer deptid = (Integer)g4Dao.queryForObject("Organization.queryDeptidByCascadeid", cascadeid);
		return deptid;
	}

}
