package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcShiftApplyService extends BaseService {

	public Dto saveAdcShiftApplyItem(Dto pDto);

	public Dto updateAdcShiftApplyItem(Dto pDto);

	public Dto deleteAdcShiftApplyItem(Dto pDto);
}
