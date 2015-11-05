package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcAttendTypeService extends BaseService {

	public Dto saveAdcAttendTypeItem(Dto pDto);

	public Dto updateAdcAttendTypeItem(Dto pDto);

	public Dto deleteAdcAttendTypeItem(Dto pDto);
}
