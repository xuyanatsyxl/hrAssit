package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcShiftBasicService extends BaseService {

	public Dto saveAdcShiftBasicItem(Dto pDto);

	public Dto updateAdcShiftBasicItem(Dto pDto);

	public Dto deleteAdcShiftBasicItem(Dto pDto);
}
