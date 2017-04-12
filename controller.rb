#controller
class NoaaGetsController < ApplicationController
  def ask
  end

  def self.get_nasa_show
    nasa_ask = "http://www.lmsal.com/hek/her?cosec=2&cmd=search&type=column&event_type=fl,ar,cr,bu,ee&event_starttime=2001-03-14T00:00:00&event_endtime="+Time.now.strftime("%Y-%d-%m %H:%M:%S %Z")+"&temporalmode=strict&event_coordsys=helioprojective&x1=-1200&x2=1200&y1=-1200&y2=1200"
    request_to_nasa_ask = Net::HTTP.get(URI(nasa_ask))
    JSON.parse request_to_nasa_ask
  end

  def show
    @start_time = params[:event_starttime]
    @end_time = params[:event_endtime]
    nasa_ask = "http://www.lmsal.com/hek/her?cosec=2&cmd=search&type=column&event_type=fl,ar,cr,bu,ee&event_starttime=#{@start_time}T00:00:00&event_endtime=#{@end_time}T00:00:00&temporalmode=strict&event_coordsys=helioprojective&x1=-1200&x2=1200&y1=-1200&y2=1200"
    @nasa_info = Net::HTTP.get(URI(nasa_ask))
    @nasa_easy = JSON.parse @nasa_info
    @nasa_result = @nasa_easy['result']
  end

  def index
  	@helio_info = NoaaApi.get_api_info['result']
    @helio_data = @helio_info[-1]['event_score']
    @helio_data1 = @helio_info[-1]['event_starttime']
  end
