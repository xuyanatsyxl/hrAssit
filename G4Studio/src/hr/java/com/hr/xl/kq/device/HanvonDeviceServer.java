package com.hr.xl.kq.device;

import java.io.IOException;
import java.net.InetAddress;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.g4studio.common.dao.Reader;
import org.g4studio.common.util.SpringBeanLoader;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;

import com.hanvon.faceid.sdk.IDgramPacketHandler;
import com.hanvon.faceid.sdk.ISocketServerThreadTask;
import com.hanvon.faceid.sdk.NetworkStreamPlus;
import com.hanvon.faceid.sdk.TcpListenerPlus;
import com.hanvon.faceid.sdk.UdpClientPlus;
import com.hr.xl.kq.service.DkjlService;

public class HanvonDeviceServer implements ISocketServerThreadTask,
		IDgramPacketHandler {

	private static Log log = LogFactory.getLog(HanvonDeviceServer.class);

	private DkjlService dkjlSrv = null;
	private Reader g4Reader = null;

	private int tcpPort = 9923;
	private int udpPort = 9924;

	private TcpListenerPlus tcpServer = null;
	private UdpClientPlus udpServer = null;

	private final String deviceCharset = "GBK";
	private boolean isServerRunning = false;
	private String secretKey = null;

	public String getValueFromRecord(String rec, String ch) {
		Dto dto = new BaseDto();
		ch += "=\"";
		String subStr = rec.substring(rec.indexOf(ch) + ch.length(),
				rec.length());
		subStr = subStr.substring(0, subStr.indexOf("\""));
		return subStr;
	}

	public void startServer() throws Exception, IOException {
		tcpServer = new TcpListenerPlus(tcpPort);
		tcpServer.setSecretKey(secretKey);
		tcpServer.ThreadTaskDelegate = this;

		udpServer = new UdpClientPlus(udpPort);
		udpServer.setSecretKey(secretKey);
		udpServer.DgramPacketHandler = this;
		udpServer.CharsetName = deviceCharset;

		isServerRunning = true;

		tcpServer.StartListenThread(null, 20, 0);
		udpServer.StartListenThread(null, 20);
		log.info("启动成功！");
	}

	public void stopServer() throws IOException {
		if (isServerRunning) {
			if (tcpServer != null) {
				tcpServer.close();
				tcpServer = null;
				isServerRunning = false;
			}
		}
	}

	public void setSecretKey(String key) {
		this.secretKey = key;
	}

	@Override
	public void OnServerTaskRequest(NetworkStreamPlus stream) throws Exception {
		// TODO Auto-generated method stub

		dkjlSrv = (DkjlService) SpringBeanLoader.getSpringBean("dkjlService");
		g4Reader = (Reader) SpringBeanLoader.getSpringBean("g4Reader");
		String sn = null;
		while (true) {
			try {
				String answer = stream.Read(deviceCharset);
				if (answer.startsWith("PostRecord")) {
					sn = getValueFromRecord(answer, "sn");
					stream.Write(
							"Return(result=\"success\" postphoto=\"false\")",
							deviceCharset);
				} else if (answer.startsWith("Record")) {
					Dto inDto = new BaseDto();
					Dto pDto = new BaseDto();

					inDto.put("devsn", sn);
					pDto = (Dto) g4Reader.queryForObject(
							"DKJLB.getDkjidByDevsn", inDto);
					if (G4Utils.isEmpty(pDto)) {
						break;
					}
					inDto.put("deptid", pDto.getAsString("deptid"));
					inDto.put("dklx", pDto.getAsString("dklx"));
					inDto.put("dksj", getValueFromRecord(answer, "time"));
					inDto.put("dkjid", pDto.getAsString("dkjid"));
					inDto.put("empid", getValueFromRecord(answer, "id"));
					inDto.put("bz", answer);

					dkjlSrv.saveDkjlItem(inDto);
					stream.Write("Return(result=\"success\")", deviceCharset);
				} else if (answer.startsWith("Quit")) {
					break;
				}
			} catch (Exception ex) {
				ex.printStackTrace();
				break;
			}
		}
	}

	@Override
	public void OnDgramPacketReceived(InetAddress arg0, int arg1, byte[] arg2)
			throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public void OnDgramPacketReceived(InetAddress arg0, int arg1, String arg2)
			throws Exception {
		// TODO Auto-generated method stub
		String msg = "来自" + arg0.getHostName() + "内容：" + arg2 + "\r\n";
		log.info(msg);
	}

}
