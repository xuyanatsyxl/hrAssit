package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcShiftExceptionService extends BaseService {

	public Dto updateAdcShiftExceptionItem(Dto pDto);

	public Dto saveAdcShiftExceptionItem(Dto pDto);
}
