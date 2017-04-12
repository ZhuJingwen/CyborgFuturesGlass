#model
require 'time'
class NoaaApi < ApplicationRecord
	def self.get_api_info
  		noaa_api = "http://www.lmsal.com/hek/her?cosec=2&cmd=search&type=column&event_type=fl,ar,cr,bu,ee&event_starttime="+DateTime.yesterday.strftime('%Y-%m-%d %I:%M:%S')+"&event_endtime="+Time.now.strftime("%Y-%d-%m %H:%M:%S %Z")+"&temporalmode=strict&event_coordsys=helioprojective&x1=-1200&x2=1200&y1=-1200&y2=1200"
  		request_to_noaa_api = Net::HTTP.get(URI(noaa_api))
  		JSON.parse request_to_noaa_api
	end
end
