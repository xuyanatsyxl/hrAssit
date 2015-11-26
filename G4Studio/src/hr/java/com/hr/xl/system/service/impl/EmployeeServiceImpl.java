package com.hr.xl.system.service.impl;

import java.util.List;

import org.g4studio.common.dao.Reader;
import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.util.idgenerator.IdGenerator;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.hr.xl.system.service.EmployeeService;

public class EmployeeServiceImpl extends BaseServiceImpl implements
		EmployeeService {
	
	private OrganizationService organizationService;
	
	
	public OrganizationService getOrganizationService() {
		return organizationService;
	}

	public void setOrganizationService(OrganizationService organizationService) {
		this.organizationService = organizationService;
	}

	public Dto saveEmployeeItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	public Dto updateEmployeeItem(Dto pDto) {
		Dto outDto = new BaseDto();
		g4Dao.update("EMPLOYEE.updateEmplItem", pDto);
		pDto.put("deptname",
				getDeptFullNameByDeptid(pDto.getAsString("deptid")));
		g4Dao.update("Deptempl.updateDeptemplItem", pDto);
		return null;
	}

	public Dto deleteEmployeeItem(Dto pDto) {
		Dto dto = new BaseDto();
		Dto outDto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("empid", arrChecked[i]);
			Integer temp = (Integer) g4Dao.queryForObject("EMPLOYEE.checkdkjl",
					pDto);
			if (temp.intValue() != 0) {
				outDto.put("msg", "该用户已经有打卡记录，不能删除！");
				outDto.put("success", new Boolean(false));
			} else {
				g4Dao.delete("Deptempl.deleteDeptemplItem", dto);
				g4Dao.delete("EMPLOYEE.deleteEmplItem", dto);
			}
		}
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "员工删除成功！");
		return outDto;
	}

	public String getDeptFullNameByDeptid(String deptid) {
		String lsdeptname = null;
		if (G4Utils.isEmpty(deptid)) {
			return null;
		}
		if (deptid.equalsIgnoreCase("001")) {
			BaseDto mDto = new BaseDto();
			mDto.put("deptid", deptid);
			Dto dto = (Dto) g4Dao.queryForObject(
					"Organization.queryDeptinfoByDeptid", mDto);
			return dto.getAsString("deptname");
		}
		for (int i = 2; i <= deptid.length() / 3; i++) {
			String lsdept = deptid.substring(0, 3 * i);
			BaseDto pDto = new BaseDto();
			pDto.put("deptid", lsdept);
			Dto deptDto = (Dto) g4Dao.queryForObject(
					"Organization.queryDeptinfoByDeptid", pDto);
			if (i == 2) {
				lsdeptname = deptDto.getAsString("deptname");
			} else {
				lsdeptname += "-" + deptDto.getAsString("deptname");
			}
		}
		return lsdeptname;
	}

	/**
	 * 根据HR系统的信息更新人员信息
	 */
	public Dto upateEmplDept(Dto pDto) {
		Dto dto = new BaseDto();
		Dto outDto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		ApplicationContext ctx = new ClassPathXmlApplicationContext(
				new String[] { "config\\global.dao.hr.xml" });
		Reader hrReader = (Reader) ctx.getBean("hrReader");

		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("empid", arrChecked[i]);
			// 更新员工的所属部门信息
			Dto newInfoDto = (BaseDto) hrReader.queryForObject(
					"HR.queryHremplForManage", dto);
			if (G4Utils.isNotEmpty(newInfoDto)) {
				// 取得岗位信息
				String jobName = newInfoDto.getAsString("c_jobname");
				Integer deptid = getDeptidByDeptName(newInfoDto.getAsString("c_unitname"));
				int zwid = getZbzwid(newInfoDto.getAsString("c_dyzbzw"));
				Dto upDto = new BaseDto();
				upDto.put("deptid", deptid);
				upDto.put("empid", newInfoDto.getAsInteger("c_employeeid"));
				upDto.put("deptname", newInfoDto.getAsString("c_unitname"));
				upDto.put("zbzwid", zwid);
				upDto.put("jobname", jobName);
				g4Dao.update("Deptempl.updateDeptemplItem", upDto);
			}else{
				//如果没找着信息就需要标记为离职
				Dto empDto = new BaseDto();
				empDto.put("empid", arrChecked[i]);
				empDto.put("dqzt", "4");
				g4Dao.update("EMPLOYEE.updateEmplItem", empDto);
			}
		}
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "员工信息更新成功！");
		return outDto;
	}

	/**
	 * 根据HR传过来的UNITNAME查找组织架构
	 * @param fullDeptName
	 * @return
	 */
	private Integer getDeptidByDeptName(String fullDeptName) {
		String[] dList = fullDeptName.split("-");
		String cascadeid = null;
		int i = 0;
		for (String dept : dList) {
			Dto paramDto = new BaseDto();
			paramDto.put("deptname", dept);
			if (i > 0) {
				paramDto.put("cascadeid", cascadeid);
			}
			paramDto.put("level", (i + 2) * 3);
			List<Dto> deptList = g4Dao.queryForList("Deptempl.queryDeptItem",
					paramDto);
			if (deptList.size() == 0) {
				// 新部门
				Dto deptDto = new BaseDto();
				deptDto.put("deptname", dept);
				if (i == 0) {
					deptDto.put("cascadeid", "001");
				} else {
					deptDto.put("cascadeid", cascadeid);
				}
				cascadeid = IdGenerator.getDeptIdGenerator(deptDto
						.getAsInteger("parentid"));
				deptDto.put("cascadeid", cascadeid);
				deptDto.put("leaf", new Boolean(false));
				deptDto.put("sortno",
						cascadeid.substring(cascadeid.length() - 3, cascadeid.length()));
				deptDto.put("enabled", new Boolean(true));
				g4Dao.insert("Organization.saveDeptItem", deptDto);
			} else {
				cascadeid = deptList.get(0).getAsString("cascadeid");
			}
			i++;
		}
		Integer deptid = organizationService.queryDeptidByCascadeid(cascadeid);
		return deptid;
	}

	private int getZbzwid(String zwname) {
		Dto dto = new BaseDto();
		dto.put("zwmc", zwname);
		List<Dto> list = g4Dao.queryForList("Zbzw.queryZbzwForManage", dto);
		if (list.size() == 0) {
			return 1;
		} else {
			return list.get(0).getAsInteger("value");
		}
	}
}
