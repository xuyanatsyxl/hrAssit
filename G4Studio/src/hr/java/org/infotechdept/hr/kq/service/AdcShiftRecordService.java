package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcShiftRecordService extends BaseService {

	public Dto saveAdcShiftRecordItem(Dto pDto);

	public Dto deleteAdcShiftRecordItem(Dto pDto);

	public Dto updateAdcShiftRecordItem(Dto pDto);
	
	public Dto saveAdcShiftRecordLogsItem(Dto pDto);
}
