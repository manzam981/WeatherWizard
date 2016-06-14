import TimerMixin from 'react-timer-mixin';
const React = require('react')
const ReactDOM = require('react-dom')
const Form = require('./Form.jsx')
const Report = require('./Report.jsx')
const $ = require('jquery')
require('./map.js')

var ReportUI = React.createClass({

    mixins: [TimerMixin],
    getInitialState: function () {
        return {
            weather: {},
            location: {},
            info: {},
            currentCity: {},
            forecastDelivered: false,
            forecast: []
        }
    },
    
    loadWeatherByCity: function (city) {
        var url = 'http://api.apixu.com/v1/forecast.json?key=a76117fc3c5841c7b5c152812161206&q=' + city + '&days=10';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({location: data.location, weather: data.current, info: data.current.condition, forecast: data.forecast.forecastday});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }
        });
    },

    searchByCity: function ()
    {
        this.setState({forecastDelivered:false});
        var text = document.getElementById('cityText').value;
        this.loadWeatherByCity(text);
        this.setState({currentCity:text});
    },

    loadWeatherByLocation: function()
    {
        var city;
        this.setState({currentCity: city});
        var getIpUrl='http://ip-api.com/json';
        $.ajax({
            url: getIpUrl,
            dataType: 'json',
            cache: false,
            success: function(data) {
                city = data.city;
                this.loadWeatherByCity(city);
                this.setState({currentCity:city});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function()
    {
        this.loadWeatherByLocation();
        this.setInterval(() => {this.loadWeatherByCity(this.state.currentCity);}, 60000);
        $(document.body).on('keydown', this.submitEnter);
    },

    submitEnter:function(e)
    {
        if (e.keyCode === 13) {
            this.setState({forecastDelivered:false});
            var text = document.getElementById('cityText').value;
            this.loadWeatherByCity(text);
            this.setState({currentCity:text});
        }
    },

    changeForecastStatus:function()
    {
        this.setState({forecastDelivered:true});
    },
    
    render: function() {
        return (
            <div>
                <Form search={this.searchByCity} />
                <Report weather={this.state.weather} location={this.state.location} changeStatus={this.changeForecastStatus} status={this.state.forecastDelivered} info={this.state.info} />
            </div>
        );
    }
});

ReactDOM.render(<ReportUI/>, document.getElementById('reportUI'))