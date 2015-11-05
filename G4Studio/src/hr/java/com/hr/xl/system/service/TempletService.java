package com.hr.xl.system.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface TempletService extends BaseService {

	public Dto saveTempletItem(Dto pDto);

	public Dto deleteTempletItem(Dto pDto);

	public Dto updateTempletItem(Dto pDto);
}
