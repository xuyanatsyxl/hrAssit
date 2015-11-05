package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcOvertimeService extends BaseService {
	public Dto saveAdcOvertimeItem(Dto pDto);

	public Dto deleteAdcOvertimeItems(Dto pDto);

	public Dto updateAdcOvertimeItem(Dto pDto);

	public Dto importFromExcel(Dto pDto);

	public Dto updateAdcOvertimeRptstate(Dto pDto);
}
