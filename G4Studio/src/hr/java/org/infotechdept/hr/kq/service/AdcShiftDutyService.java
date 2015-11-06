package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcShiftDutyService extends BaseService{

	public Dto saveAdcShiftDutyItem(Dto pDto);
	
	public Dto updateAdcShiftDutyItem(Dto pDto);
	
	public Dto deleteAdcShiftDutyItem(Dto pDto);
	
	public Dto saveAdcShiftDutyDetailItem(Dto pDto);
	
	public Dto updateAdcShiftDutyDetailItem(Dto pDto);
	
	public Dto deleteAdcShiftDutyDetailItem(Dto pDto);
	
	public Dto importFromExcel(Dto pDto);
	
	public Dto updateAdcShiftDutyRptstate(Dto pDto);
}
