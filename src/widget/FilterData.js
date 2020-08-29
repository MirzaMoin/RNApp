import React, { Component } from 'react';
import {
    View,
    Picker,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput,
    Modal
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default class Filter extends Component {
    constructor(props) {
        super(props);
        let { startYear, endYear, selectedYear, selectedMonth, visiable } = props;
        let years = this.getYears(startYear, endYear);
        let months = this.getMonths();
        selectedYear = selectedYear || years[0];
        selectedMonth = selectedMonth || ((new Date()).getMonth() + 1);
        this.state = {
            years,
            months,
            selectedYear,
            selectedMonth,
            visiable: visiable || false
        }
    }

    show = async ({filters}) => {
       /* let years = this.getYears(startYear, endYear);
        let months = this.getMonths();
        selectedYear = selectedYear || years[0];
        selectedMonth = selectedMonth || ((new Date()).getMonth() + 1);*/
        //this.setState({filtersOption: filters})
        let promise = new Promise((resolve, clear) => {
            this.confirm = ({selectedFilter, isClear}) => {
                resolve({
                    selectedFilter,
                    isClear
                });
            }
            this.clear = () => {
                clear({clear:true})
            }
            this.setState({
                visiable: true,
                filtersOption: filters,
                isClear: false,
            })
        })
        return promise;
    }

    dismiss = () => {
        this.setState({
            visiable: false
        })
    }

    getYears = (startYear, endYear) => {
        startYear = startYear || (new Date()).getFullYear();
        endYear = endYear || (new Date()).getFullYear();
        let years = []
        for (let i = startYear; i <= endYear; i++) {
            years.push(i)
        }
        return years;
    }

    getMonths = () => {
        let months = []
        for (let i = 1; i <= 12; i++) {
            months.push(i);
        }
        return months;
    }

    renderPickerItems = (data) => {
        let items = data.map((value, index) => {
            return (<Picker.Item key={'r-' + index} label={'' + value.display} value={value} />)
        })
        return items;
    }

    onCancelPress = () => {
        const confirm = this.confirm;
        const { selectedFilter } = this.state;
        const isClear = true;
        confirm && confirm({selectedFilter, isClear});
        this.dismiss();
        this.setState({
            selectedFilter: {},
            search: '',
        })
    }

    onConfirmPress = () => {
        const confirm = this.confirm;
        const { selectedFilter } = this.state;
        const isClear = false;
        confirm && confirm({selectedFilter, isClear});
        this.dismiss();
    }

    _renderClearSearch = () => {
        if(this.state.search){
          return(
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={()=>{
                  this.setState({search: ''})
                  this.props.onSearch('');
                }}>
              <MDIcon name={'close'} style={{fontSize: 24}} />
            </TouchableOpacity>
          )
        }
      }

    render() {
        const { years, months, selectedYear, selectedMonth, visiable } = this.state;
        if (!visiable) return null;
        return (
            <TouchableOpacity
                style={styles.modal}
                onPress={this.onCancelPress}>
                <View style={styles.outerContainer}>
                    <View style={styles.toolBar}>
                        <TouchableOpacity style={styles.toolBarButton} onPress={this.onCancelPress}>
                            <Text style={styles.toolBarButtonText}>Clear</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={styles.toolBarButton} onPress={this.onConfirmPress}>
                            <Text style={styles.toolBarButtonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row',paddingHorizontal: 10, marginVertical: 5, borderWidth: 2, borderRadius: 5, borderColor: 'rgba(153,153,153,1)', alignItems: 'center', marginTop: 10, marginHorizontal: 20}}>
                        <MDIcon name={'search'} style={{fontSize: 24}} />
                        <TextInput
                            placeholder="Enter name"
                            style={{flex: 1}}
                            value={this.state.search}
                            onChangeText={(text) => {
                                this.setState({
                                    search: text
                                });
                                this.props.onSearch(text);
                            }}/>
                        {this._renderClearSearch()}
                    </View>
                    <View style={styles.innerContainer}>
                        <MDIcon name={'date-range'} style={{fontSize: 20, alignSelf: 'center'}} />
                        <Picker
                            style={styles.picker}
                            selectedValue={this.state.selectedFilter}
                            onValueChange={(itemValue, itemIndex) => {
                                console.log(`Selected Item ${JSON.stringify(itemValue)} at ${itemIndex}`)
                                this.setState({
                                    selectedFilter: itemValue
                                })
                            }}>
                            {this.renderPickerItems(this.state.filtersOption)}
                        </Picker>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    outerContainer: {
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    toolBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 44,
        borderBottomWidth: 1,
        borderColor: '#EBECED',
    },
    toolBarButton: {
        height: 44,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    toolBarButtonText: {
        fontSize: 15,
        color: '#2d4664',
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginRight: 10,
    },
    picker: {
        flex: 1,
    }
})