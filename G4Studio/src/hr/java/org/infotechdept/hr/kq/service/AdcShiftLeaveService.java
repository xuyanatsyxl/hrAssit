package org.infotechdept.hr.kq.service;

import java.util.Date;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcShiftLeaveService extends BaseService {

	public Dto saveAdcShiftLeaveItem(Dto pDto);

	public Dto updateAdcShiftLeaveItem(Dto pDto);

	public Dto deleteAdcShiftLeaveItem(Dto pDto);
	
}
