package com.hr.xl.system.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface EmployeeService extends BaseService {
	public Dto saveEmployeeItem(Dto pDto);

	public Dto updateEmployeeItem(Dto pDto);

	public Dto deleteEmployeeItem(Dto pDto);

	public String getDeptFullNameByDeptid(String deptid);

	public Dto upateEmplDept(Dto pDto);
}
