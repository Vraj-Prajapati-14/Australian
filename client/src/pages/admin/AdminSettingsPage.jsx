import { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Divider,
  Upload,
  Image,
  message,
  Tabs,
  Select,
  InputNumber,
  ColorPicker,
  Spin,
  Alert,
  Tag,
  Tooltip,
  Modal,
  Badge,
  Statistic,
  Collapse,
  Checkbox,
  Radio,
  Slider,
  TimePicker,
  DatePicker,
  Empty,
  Result,
  Skeleton,
  Timeline,
  Steps,
  Affix,
  Anchor,
  BackTop,
  ConfigProvider,
  theme
} from 'antd';
import { 
  SaveOutlined, 
  UploadOutlined,
  PictureOutlined,
  SettingOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  CopyOutlined,
  DownloadOutlined,
  ImportOutlined,
  ExportOutlined,
  // ResetOutlined, // This icon doesn't exist in this version of @ant-design/icons
  InfoCircleOutlined,
  SecurityScanOutlined,
  // PerformanceOutlined, // This icon doesn't exist in @ant-design/icons
  NotificationOutlined,
  // IntegrationOutlined,
  // BusinessOutlined,
  FileTextOutlined,
  LockOutlined,
  KeyOutlined,
  ApiOutlined,
  CloudOutlined,
  DatabaseOutlined,
  MonitorOutlined,
  BugOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  ExperimentOutlined,
  ToolOutlined,
  BuildOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  AreaChartOutlined,
  // ColumnChartOutlined,
  // ScatterPlotOutlined,
  HeatMapOutlined,
  BoxPlotOutlined,
  RadarChartOutlined,
  FunnelPlotOutlined,
  // WaterfallOutlined,
  // GaugeOutlined,
  FundOutlined,
  RiseOutlined,
  FallOutlined,
  StockOutlined,
  DollarOutlined,
  EuroOutlined,
  PoundOutlined,
  // YenOutlined,
  // BitcoinOutlined,
  WalletOutlined,
  CreditCardOutlined,
  BankOutlined,
  InsuranceOutlined,
  SafetyOutlined,
  // ShieldOutlined,
  FireOutlined,
  AlertOutlined,
  WarningOutlined,
  StopOutlined,
  CheckOutlined,
  CloseOutlined,
  QuestionOutlined,
  ExclamationOutlined,
  HeartOutlined,
  StarOutlined,
  LikeOutlined,
  DislikeOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  CrownOutlined,
  TrophyOutlined,
  // MedalOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { Step } = Steps;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [themePreview, setThemePreview] = useState(false);
  const queryClient = useQueryClient();

  // Forms for different sections
  const [generalForm] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [socialForm] = Form.useForm();
  const [seoForm] = Form.useForm();
  const [appearanceForm] = Form.useForm();
  const [businessForm] = Form.useForm();
  const [contentForm] = Form.useForm();
  const [integrationsForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [performanceForm] = Form.useForm();
  const [notificationsForm] = Form.useForm();

  // Fetch settings data
  const { data: settings = {}, isLoading, error, refetch } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch settings summary
  const { data: summary = {} } = useQuery({
    queryKey: ['settings-summary'],
    queryFn: async () => {
      const response = await api.get('/settings/summary');
      return response.data || {};
    }
  });

  // Update section mutation
  const updateSectionMutation = useMutation({
    mutationFn: ({ section, data }) => api.put(`/settings/section/${section}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      queryClient.invalidateQueries(['settings-summary']);
      message.success('Settings updated successfully');
    },
    onError: (error) => {
      message.error('Error updating settings: ' + (error.response?.data?.error || error.message));
    }
  });

  // Reset settings mutation
  const resetSettingsMutation = useMutation({
    mutationFn: (section) => section ? api.post(`/settings/reset/${section}`) : api.post('/settings/reset'),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      queryClient.invalidateQueries(['settings-summary']);
      message.success('Settings reset successfully');
      setResetModalVisible(false);
    },
    onError: (error) => {
      message.error('Error resetting settings: ' + (error.response?.data?.error || error.message));
    }
  });

  // Export settings mutation
  const exportSettingsMutation = useMutation({
    mutationFn: () => api.get('/settings/export'),
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site-settings-${dayjs().format('YYYY-MM-DD-HH-mm')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('Settings exported successfully');
      setExportModalVisible(false);
    },
    onError: (error) => {
      message.error('Error exporting settings: ' + (error.response?.data?.error || error.message));
    }
  });

  // Import settings mutation
  const importSettingsMutation = useMutation({
    mutationFn: (settingsData) => api.post('/settings/import', { settings: settingsData }),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      queryClient.invalidateQueries(['settings-summary']);
      message.success('Settings imported successfully');
    },
    onError: (error) => {
      message.error('Error importing settings: ' + (error.response?.data?.error || error.message));
    }
  });

  // Theme management functions
  const setThemePreset = (preset) => {
    const presets = {
      'black-white': {
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        textColor: '#000000',
        backgroundColor: '#ffffff'
      },
      'blue': {
        primaryColor: '#1677ff',
        secondaryColor: '#ffffff',
        textColor: '#000000',
        backgroundColor: '#ffffff'
      },
      'green': {
        primaryColor: '#52c41a',
        secondaryColor: '#ffffff',
        textColor: '#000000',
        backgroundColor: '#ffffff'
      }
    };

    const themeData = presets[preset];
    if (themeData) {
      appearanceForm.setFieldsValue({
        appearance: themeData
      });
      message.success(`${preset} theme applied`);
    }
  };

  const previewTheme = () => {
    const values = appearanceForm.getFieldsValue();
    if (values.appearance) {
      setThemePreview(true);
      // Apply theme preview to the current page
      const style = document.createElement('style');
      style.id = 'theme-preview';
      style.textContent = `
        :root {
          --primary-color: ${values.appearance.primaryColor || '#000000'};
          --secondary-color: ${values.appearance.secondaryColor || '#ffffff'};
          --text-color: ${values.appearance.textColor || '#000000'};
          --background-color: ${values.appearance.backgroundColor || '#ffffff'};
        }
      `;
      document.head.appendChild(style);
      message.success('Theme preview applied');
    }
  };

  const resetTheme = () => {
    const defaultTheme = {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      textColor: '#000000',
      backgroundColor: '#ffffff'
    };
    appearanceForm.setFieldsValue({
      appearance: defaultTheme
    });
    
    // Remove preview styles
    const previewStyle = document.getElementById('theme-preview');
    if (previewStyle) {
      previewStyle.remove();
    }
    setThemePreview(false);
    message.success('Theme reset to default');
  };

  // Set form values when settings data loads
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      // Use setTimeout to ensure forms are properly mounted
      const timer = setTimeout(() => {
        try {
          generalForm.setFieldsValue(settings.general || {});
          contactForm.setFieldsValue(settings.contact || {});
          socialForm.setFieldsValue(settings.social || {});
          seoForm.setFieldsValue(settings.seo || {});
          appearanceForm.setFieldsValue(settings.appearance || {});
          businessForm.setFieldsValue(settings.business || {});
          contentForm.setFieldsValue(settings.content || {});
          integrationsForm.setFieldsValue(settings.integrations || {});
          securityForm.setFieldsValue(settings.security || {});
          performanceForm.setFieldsValue(settings.performance || {});
          notificationsForm.setFieldsValue(settings.notifications || {});
        } catch (error) {
          // Forms might not be ready yet, this is normal during initial render
          console.log('Forms not ready yet, will retry on next render');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [settings]);

  // Handle form submissions
  const handleSectionSave = async (section, form) => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await updateSectionMutation.mutateAsync({ section, data: values });
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload for import
  const handleImportUpload = (info) => {
    setFileList(info.fileList.slice(-1));
    
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settingsData = JSON.parse(e.target.result);
          if (settingsData.settings) {
            importSettingsMutation.mutate(settingsData.settings);
          } else {
            message.error('Invalid settings file format');
          }
        } catch (error) {
          message.error('Error parsing settings file');
        }
      };
      reader.readAsText(info.file.originFileObj);
    }
  };

  // Modern CSS styles
  const containerStyle = {
    padding: '32px',
    background: '#ffffff',
    minHeight: '100vh'
  };

  const pageHeaderStyle = {
    marginBottom: '32px'
  };

  const titleStyle = {
    color: '#1a1a1a',
    margin: 0,
    fontWeight: '700',
    fontSize: '28px',
    letterSpacing: '-0.5px'
  };

  const subtitleStyle = {
    color: '#666',
    fontSize: '16px',
    marginTop: '8px',
    lineHeight: '1.5'
  };

     const summaryCardStyle = {
     background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
     border: '1px solid #dee2e6',
     borderRadius: '16px',
     color: '#1a1a1a',
     marginBottom: '24px'
   };

  const tabsCardStyle = {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  };

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  };

  const buttonStyle = {
    height: '40px',
    borderRadius: '8px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
    border: 'none',
    boxShadow: '0 2px 8px rgba(22, 119, 255, 0.3)'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)',
    border: 'none',
    boxShadow: '0 2px 8px rgba(255, 77, 79, 0.3)'
  };

  const inputStyle = {
    borderRadius: '8px',
    border: '2px solid #f0f0f0',
    padding: '8px 12px',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  };

  const selectStyle = {
    borderRadius: '8px',
    border: '2px solid #f0f0f0'
  };

  const formItemStyle = {
    marginBottom: '20px'
  };

  const dividerStyle = {
    margin: '24px 0',
    borderColor: '#f0f0f0'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
    background: '#ffffff'
  };

  const errorStyle = {
    padding: '32px',
    background: '#ffffff'
  };

  if (isLoading) {
    return (
      <div style={loadingStyle}>
        <Spin size="large" style={{ color: '#1677ff' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        <Alert
          message="Error Loading Settings"
          description="There was an error loading the settings data. Please try refreshing the page."
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => refetch()}>
              Refresh
            </Button>
          }
        />
      </div>
    );
  }

  // Tab items for the comprehensive settings
  const tabItems = [
    {
      key: 'general',
      label: (
        <span>
          <SettingOutlined style={{ marginRight: '8px' }} />
          General
        </span>
      ),
      children: (
        <Card title="General Site Settings" style={cardStyle}>
          <Form
            form={generalForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('general', generalForm)}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="siteName"
                  label="Site Name"
                  rules={[{ required: true, message: 'Please enter site name' }]}
                  style={formItemStyle}
                >
                  <Input placeholder="Australian Engineering Solutions" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="siteTagline"
                  label="Site Tagline"
                  style={formItemStyle}
                >
                  <Input placeholder="Professional Vehicle Solutions" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="siteDescription"
              label="Site Description"
              rules={[{ required: true, message: 'Please enter site description' }]}
              style={formItemStyle}
            >
              <TextArea rows={3} placeholder="Brief description of your business..." style={inputStyle} />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="companyName"
                  label="Company Name"
                  rules={[{ required: true, message: 'Please enter company name' }]}
                  style={formItemStyle}
                >
                  <Input placeholder="Australian Engineering Solutions" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="founded"
                  label="Founded Year"
                  style={formItemStyle}
                >
                  <Input placeholder="2010" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="industry"
                  label="Industry"
                  style={formItemStyle}
                >
                  <Input placeholder="Automotive & Manufacturing" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="employees"
                  label="Number of Employees"
                  style={formItemStyle}
                >
                  <Input placeholder="50+" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="website"
                  label="Website URL"
                  rules={[{ required: true, message: 'Please enter website URL' }]}
                  style={formItemStyle}
                >
                  <Input placeholder="https://australianengineering.com.au" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="timezone"
                  label="Timezone"
                  style={formItemStyle}
                >
                  <Select placeholder="Select timezone" style={selectStyle}>
                    <Option value="Australia/Sydney">Australia/Sydney</Option>
                    <Option value="Australia/Melbourne">Australia/Melbourne</Option>
                    <Option value="Australia/Brisbane">Australia/Brisbane</Option>
                    <Option value="Australia/Perth">Australia/Perth</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="currency"
                  label="Currency"
                  style={formItemStyle}
                >
                  <Select placeholder="Select currency" style={selectStyle}>
                    <Option value="AUD">AUD - Australian Dollar</Option>
                    <Option value="USD">USD - US Dollar</Option>
                    <Option value="EUR">EUR - Euro</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="maintenanceMode"
                  label="Maintenance Mode"
                  valuePropName="checked"
                  style={formItemStyle}
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="language"
                  label="Default Language"
                  style={formItemStyle}
                >
                  <Select placeholder="Select language" style={selectStyle}>
                    <Option value="en">English</Option>
                    <Option value="es">Spanish</Option>
                    <Option value="fr">French</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="maintenanceMessage"
              label="Maintenance Message"
              style={formItemStyle}
            >
              <TextArea rows={2} placeholder="Site is under maintenance. Please check back soon." style={inputStyle} />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save General Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'contact',
      label: (
        <span>
          <PhoneOutlined style={{ marginRight: '8px' }} />
          Contact
        </span>
      ),
      children: (
        <Card title="Contact Information" style={cardStyle}>
          <Form
            form={contactForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('contact', contactForm)}
          >
            <Form.Item
              name="address"
              label="Business Address"
              rules={[{ required: true, message: 'Please enter business address' }]}
              style={formItemStyle}
            >
              <TextArea rows={3} placeholder="Full business address..." style={inputStyle} />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Main Phone"
                  rules={[{ required: true, message: 'Please enter main phone' }]}
                  style={formItemStyle}
                >
                  <Input placeholder="+61 2 1234 5678" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="mobile"
                  label="Mobile Phone"
                  style={formItemStyle}
                >
                  <Input placeholder="+61 400 123 456" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="email"
                  label="General Email"
                  rules={[
                    { required: true, message: 'Please enter general email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                  style={formItemStyle}
                >
                  <Input placeholder="info@australianengineering.com.au" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="supportEmail"
                  label="Support Email"
                  rules={[{ type: 'email', message: 'Please enter valid email' }]}
                  style={formItemStyle}
                >
                  <Input placeholder="support@australianengineering.com.au" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="salesEmail"
                  label="Sales Email"
                  rules={[{ type: 'email', message: 'Please enter valid email' }]}
                  style={formItemStyle}
                >
                  <Input placeholder="sales@australianengineering.com.au" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="businessHours"
                  label="Business Hours"
                  style={formItemStyle}
                >
                  <Input placeholder="Monday - Friday: 8:00 AM - 6:00 PM" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="emergencyContact"
                  label="Emergency Contact"
                  style={formItemStyle}
                >
                  <Input placeholder="+61 400 999 888" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="latitude"
                  label="Latitude"
                  style={formItemStyle}
                >
                  <InputNumber 
                    placeholder="-33.8688" 
                    style={{ width: '100%' }}
                    step={0.0001}
                    precision={4}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="longitude"
                  label="Longitude"
                  style={formItemStyle}
                >
                  <InputNumber 
                    placeholder="151.2093" 
                    style={{ width: '100%' }}
                    step={0.0001}
                    precision={4}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="mapEmbedUrl"
              label="Google Maps Embed URL"
              style={formItemStyle}
            >
              <Input placeholder="https://www.google.com/maps/embed?pb=..." style={inputStyle} />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save Contact Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'social',
      label: (
        <span>
          <GlobalOutlined style={{ marginRight: '8px' }} />
          Social Media
        </span>
      ),
      children: (
        <Card title="Social Media Links" style={cardStyle}>
          <Form
            form={socialForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('social', socialForm)}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="facebook"
                  label="Facebook"
                  style={formItemStyle}
                >
                  <Input placeholder="https://facebook.com/australianengineering" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="twitter"
                  label="Twitter"
                  style={formItemStyle}
                >
                  <Input placeholder="https://twitter.com/australianengineering" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="linkedin"
                  label="LinkedIn"
                  style={formItemStyle}
                >
                  <Input placeholder="https://linkedin.com/company/australianengineering" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="instagram"
                  label="Instagram"
                  style={formItemStyle}
                >
                  <Input placeholder="https://instagram.com/australianengineering" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="youtube"
                  label="YouTube"
                  style={formItemStyle}
                >
                  <Input placeholder="https://youtube.com/australianengineering" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="tiktok"
                  label="TikTok"
                  style={formItemStyle}
                >
                  <Input placeholder="https://tiktok.com/@australianengineering" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save Social Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'seo',
      label: (
        <span>
          <GlobalOutlined style={{ marginRight: '8px' }} />
          SEO & Analytics
        </span>
      ),
      children: (
        <Card title="SEO & Analytics Settings" style={cardStyle}>
          <Form
            form={seoForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('seo', seoForm)}
          >
            <Form.Item
              name="metaTitle"
              label="Default Meta Title"
              rules={[{ required: true, message: 'Please enter meta title' }]}
              style={formItemStyle}
            >
              <Input placeholder="Australian Engineering Solutions - Professional Vehicle Solutions" style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="metaDescription"
              label="Default Meta Description"
              rules={[{ required: true, message: 'Please enter meta description' }]}
              style={formItemStyle}
            >
              <TextArea rows={3} placeholder="Brief description for search engines..." style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="metaKeywords"
              label="Meta Keywords"
              style={formItemStyle}
            >
              <Input placeholder="ute canopies, trailer service bodies, truck modifications" style={inputStyle} />
            </Form.Item>

            <Divider style={dividerStyle}>Analytics</Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="googleAnalytics"
                  label="Google Analytics ID"
                  style={formItemStyle}
                >
                  <Input placeholder="GA-123456789" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="googleTagManager"
                  label="Google Tag Manager ID"
                  style={formItemStyle}
                >
                  <Input placeholder="GTM-ABCDEF" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="facebookPixel"
                  label="Facebook Pixel ID"
                  style={formItemStyle}
                >
                  <Input placeholder="123456789" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="structuredData"
                  label="Enable Structured Data"
                  valuePropName="checked"
                  style={formItemStyle}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="sitemapEnabled"
                  label="Enable Sitemap"
                  valuePropName="checked"
                  style={formItemStyle}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="robotsTxt"
              label="Robots.txt Content"
              style={formItemStyle}
            >
              <TextArea rows={4} placeholder="User-agent: *\nAllow: /" style={inputStyle} />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save SEO Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'appearance',
      label: (
        <span>
          <PictureOutlined style={{ marginRight: '8px' }} />
          Appearance
        </span>
      ),
      children: (
        <Card title="Appearance & Branding" style={cardStyle}>
          <Form
            form={appearanceForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('appearance', appearanceForm)}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="primaryColor"
                  label="Primary Color"
                  style={formItemStyle}
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="secondaryColor"
                  label="Secondary Color"
                  style={formItemStyle}
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="accentColor"
                  label="Accent Color"
                  style={formItemStyle}
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="textColor"
                  label="Text Color"
                  style={formItemStyle}
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="backgroundColor"
                  label="Background Color"
                  style={formItemStyle}
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={dividerStyle}>Branding</Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="logo"
                  label="Logo URL"
                  style={formItemStyle}
                >
                  <Input placeholder="https://example.com/logo.png" style={inputStyle} />
                </Form.Item>
                {appearanceForm.getFieldValue('logo') && (
                  <Image
                    width={200}
                    src={appearanceForm.getFieldValue('logo')}
                    alt="Logo preview"
                    style={{ marginTop: 8, borderRadius: '8px' }}
                  />
                )}
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="favicon"
                  label="Favicon URL"
                  style={formItemStyle}
                >
                  <Input placeholder="https://example.com/favicon.ico" style={inputStyle} />
                </Form.Item>
                {appearanceForm.getFieldValue('favicon') && (
                  <Image
                    width={32}
                    src={appearanceForm.getFieldValue('favicon')}
                    alt="Favicon preview"
                    style={{ marginTop: 8, borderRadius: '4px' }}
                  />
                )}
              </Col>
            </Row>

            <Form.Item
              name="heroImage"
              label="Default Hero Image URL"
              style={formItemStyle}
            >
              <Input placeholder="https://example.com/hero.jpg" style={inputStyle} />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="headerStyle"
                  label="Header Style"
                  style={formItemStyle}
                >
                  <Select placeholder="Select header style" style={selectStyle}>
                    <Option value="modern">Modern</Option>
                    <Option value="classic">Classic</Option>
                    <Option value="minimal">Minimal</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="footerStyle"
                  label="Footer Style"
                  style={formItemStyle}
                >
                  <Select placeholder="Select footer style" style={selectStyle}>
                    <Option value="comprehensive">Comprehensive</Option>
                    <Option value="simple">Simple</Option>
                    <Option value="minimal">Minimal</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save Appearance Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'business',
      label: (
        <span>
          <BuildOutlined style={{ marginRight: '8px' }} />
          Business Information
        </span>
      ),
      children: (
        <Card title="Business Information" style={cardStyle}>
          <Form
            form={businessForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('business', businessForm)}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="businessName"
                  label="Business Name"
                  rules={[{ required: true, message: 'Please enter business name' }]}
                  style={formItemStyle}
                >
                  <Input placeholder="Australian Engineering Solutions" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="businessType"
                  label="Business Type"
                  style={formItemStyle}
                >
                  <Select placeholder="Select business type" style={selectStyle}>
                    <Option value="Sole Proprietor">Sole Proprietor</Option>
                    <Option value="Partnership">Partnership</Option>
                    <Option value="Corporation">Corporation</Option>
                    <Option value="Limited Liability Company">Limited Liability Company</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="abn"
                  label="Australian Business Number (ABN)"
                  style={formItemStyle}
                >
                  <Input placeholder="12 345 678 901" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="acn"
                  label="Australian Company Number (ACN)"
                  style={formItemStyle}
                >
                  <Input placeholder="123 456 789" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="gst"
                  label="Goods and Services Tax (GST)"
                  style={formItemStyle}
                >
                  <Select placeholder="Select GST status" style={selectStyle}>
                    <Option value="Registered">Registered</Option>
                    <Option value="Not Registered">Not Registered</Option>
                    <Option value="Exempt">Exempt</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="taxNumber"
                  label="Tax Registration Number"
                  style={formItemStyle}
                >
                  <Input placeholder="123-456-789" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="bankAccountNumber"
                  label="Bank Account Number"
                  style={formItemStyle}
                >
                  <Input placeholder="123-456-78901234567890" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="bsbNumber"
                  label="Bank Sort Code (BSB)"
                  style={formItemStyle}
                >
                  <Input placeholder="123-456" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save Business Information
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'content',
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: '8px' }} />
          Content Management
        </span>
      ),
      children: (
        <Card title="Content Management" style={cardStyle}>
          <Form
            form={contentForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('content', contentForm)}
          >
            <Form.Item
              name="footerText"
              label="Footer Text"
              style={formItemStyle}
            >
              <TextArea rows={2} placeholder="© 2023 Australian Engineering Solutions. All rights reserved." style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="copyrightText"
              label="Copyright Text"
              style={formItemStyle}
            >
              <TextArea rows={2} placeholder="© 2023 Australian Engineering Solutions. All rights reserved." style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="disclaimerText"
              label="Disclaimer Text"
              style={formItemStyle}
            >
              <TextArea rows={3} placeholder="This website is for informational purposes only. No representation is made as to the accuracy of the information provided." style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="privacyPolicyUrl"
              label="Privacy Policy URL"
              style={formItemStyle}
            >
              <Input placeholder="https://australianengineering.com.au/privacy-policy" style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="termsOfServiceUrl"
              label="Terms of Service URL"
              style={formItemStyle}
            >
              <Input placeholder="https://australianengineering.com.au/terms-of-service" style={inputStyle} />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save Content Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'integrations',
      label: (
        <span>
          <ApiOutlined style={{ marginRight: '8px' }} />
          Integrations
        </span>
      ),
      children: (
        <Card title="Integrations" style={cardStyle}>
          <Form
            form={integrationsForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('integrations', integrationsForm)}
          >
            <Form.Item
              name="googleAnalytics"
              label="Google Analytics"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="facebookPixel"
              label="Facebook Pixel"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="mailchimpApiKey"
              label="Mailchimp API Key"
              style={formItemStyle}
            >
              <Input placeholder="your-api-key-here" style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="mailchimpListId"
              label="Mailchimp List ID"
              style={formItemStyle}
            >
              <Input placeholder="your-list-id-here" style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="mailchimpApiUrl"
              label="Mailchimp API URL"
              style={formItemStyle}
            >
              <Input placeholder="https://usX.api.mailchimp.com/3.0" style={inputStyle} />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save Integrations
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined style={{ marginRight: '8px' }} />
          Security
        </span>
      ),
      children: (
        <Card title="Security Settings" style={cardStyle}>
          <Form
            form={securityForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('security', securityForm)}
          >
            <Form.Item
              name="twoFactorAuth"
              label="Two-Factor Authentication"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="passwordComplexity"
              label="Password Complexity"
              style={formItemStyle}
            >
              <Select placeholder="Select password complexity" style={selectStyle}>
                <Option value="low">Low (e.g., 123456)</Option>
                <Option value="medium">Medium (e.g., Abc123!)</Option>
                <Option value="high">High (e.g., Abc123!@#)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="sessionTimeout"
              label="Session Timeout (minutes)"
              style={formItemStyle}
            >
              <InputNumber 
                placeholder="30" 
                min={1} 
                max={1440} 
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="loginAttempts"
              label="Max Login Attempts"
              style={formItemStyle}
            >
              <InputNumber 
                placeholder="5" 
                min={1} 
                max={10} 
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="lockoutDuration"
              label="Account Lockout Duration (minutes)"
              style={formItemStyle}
            >
              <InputNumber 
                placeholder="15" 
                min={1} 
                max={60} 
                style={{ width: '100%' }}
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save Security Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'performance',
      label: (
        <span>
          <MonitorOutlined style={{ marginRight: '8px' }} />
          Performance
        </span>
      ),
      children: (
        <Card title="Performance Settings" style={cardStyle}>
          <Form
            form={performanceForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('performance', performanceForm)}
          >
            <Form.Item
              name="cacheDuration"
              label="Cache Duration (minutes)"
              style={formItemStyle}
            >
              <InputNumber 
                placeholder="60" 
                min={1} 
                max={1440} 
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="compressionEnabled"
              label="Enable Compression"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="minifyEnabled"
              label="Enable Minification"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="imageOptimization"
              label="Enable Image Optimization"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="databaseOptimization"
              label="Enable Database Optimization"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save Performance Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'notifications',
      label: (
        <span>
          <NotificationOutlined style={{ marginRight: '8px' }} />
          Notifications
        </span>
      ),
      children: (
        <Card title="Notification Settings" style={cardStyle}>
          <Form
            form={notificationsForm}
            layout="vertical"
            onFinish={(values) => handleSectionSave('notifications', notificationsForm)}
          >
            <Form.Item
              name="emailNotifications"
              label="Enable Email Notifications"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="pushNotifications"
              label="Enable Push Notifications"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="smsNotifications"
              label="Enable SMS Notifications"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="notificationSound"
              label="Enable Notification Sound"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="notificationVibration"
              label="Enable Notification Vibration"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={primaryButtonStyle}
              >
                Save Notification Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'theme',
      label: (
        <span>
          <PictureOutlined />
          Theme & Appearance
        </span>
      ),
      children: (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Color Scheme" className="settings-card">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Primary Color"
                    name={['appearance', 'primaryColor']}
                    rules={[{ required: true, message: 'Please select primary color' }]}
                  >
                    <ColorPicker
                      showText
                      format="hex"
                      defaultValue="#000000"
                      presets={[
                        {
                          label: 'Black & White',
                          colors: ['#000000', '#ffffff', '#333333', '#666666', '#999999']
                        },
                        {
                          label: 'Blue Theme',
                          colors: ['#1677ff', '#4096ff', '#69b1ff', '#91caff', '#bae0ff']
                        },
                        {
                          label: 'Green Theme',
                          colors: ['#52c41a', '#73d13d', '#95de64', '#b7eb8f', '#d9f7be']
                        },
                        {
                          label: 'Purple Theme',
                          colors: ['#722ed1', '#9254de', '#b37feb', '#d3adf7', '#efdbff']
                        }
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Secondary Color"
                    name={['appearance', 'secondaryColor']}
                  >
                    <ColorPicker
                      showText
                      format="hex"
                      defaultValue="#ffffff"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Text Color"
                    name={['appearance', 'textColor']}
                  >
                    <ColorPicker
                      showText
                      format="hex"
                      defaultValue="#000000"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Background Color"
                    name={['appearance', 'backgroundColor']}
                  >
                    <ColorPicker
                      showText
                      format="hex"
                      defaultValue="#ffffff"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider />
              
              <Title level={4}>Theme Presets</Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Card 
                    hoverable 
                    className="theme-preset-card"
                    onClick={() => setThemePreset('black-white')}
                  >
                    <div className="theme-preview black-white-theme">
                      <div className="preview-header"></div>
                      <div className="preview-content">
                        <div className="preview-button"></div>
                        <div className="preview-text"></div>
                      </div>
                    </div>
                    <div className="theme-info">
                      <Text strong>Black & White</Text>
                      <Text type="secondary">Classic monochrome theme</Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card 
                    hoverable 
                    className="theme-preset-card"
                    onClick={() => setThemePreset('blue')}
                  >
                    <div className="theme-preview blue-theme">
                      <div className="preview-header"></div>
                      <div className="preview-content">
                        <div className="preview-button"></div>
                        <div className="preview-text"></div>
                      </div>
                    </div>
                    <div className="theme-info">
                      <Text strong>Blue Theme</Text>
                      <Text type="secondary">Professional blue theme</Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card 
                    hoverable 
                    className="theme-preset-card"
                    onClick={() => setThemePreset('green')}
                  >
                    <div className="theme-preview green-theme">
                      <div className="preview-header"></div>
                      <div className="preview-content">
                        <div className="preview-button"></div>
                        <div className="preview-text"></div>
                      </div>
                    </div>
                    <div className="theme-info">
                      <Text strong>Green Theme</Text>
                      <Text type="secondary">Nature-inspired theme</Text>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card title="Live Preview" className="settings-card">
              <div className="theme-preview-container">
                <div className="preview-header">
                  <Text strong>Website Preview</Text>
                </div>
                <div className="preview-content">
                  <div className="preview-hero">
                    <div className="preview-title"></div>
                    <div className="preview-subtitle"></div>
                    <div className="preview-buttons">
                      <div className="preview-button primary"></div>
                      <div className="preview-button secondary"></div>
                    </div>
                  </div>
                  <div className="preview-section">
                    <div className="preview-card"></div>
                    <div className="preview-card"></div>
                    <div className="preview-card"></div>
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  icon={<EyeOutlined />}
                  onClick={previewTheme}
                  block
                >
                  Preview Theme
                </Button>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={resetTheme}
                  block
                >
                  Reset to Default
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )
    }
  ];

  return (
    <div style={containerStyle}>
      {/* Page Header */}
      <div style={pageHeaderStyle}>
        <Title level={2} style={titleStyle}>
          Site Settings
        </Title>
        <Paragraph style={subtitleStyle}>
          Manage your website settings, contact information, social media links, SEO settings, and appearance customization.
        </Paragraph>
      </div>

      {/* Settings Summary Card */}
      <Card style={summaryCardStyle}>
        <Row gutter={[24, 24]} align="middle">
                     <Col xs={24} md={8}>
             <Statistic
               title="Site Name"
               value={summary.siteName || 'Not configured'}
               valueStyle={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}
               titleStyle={{ color: '#1a1a1a', fontSize: '14px', fontWeight: '500' }}
             />
           </Col>
           <Col xs={24} md={8}>
             <Statistic
               title="Contact Email"
               value={summary.email || 'Not configured'}
               valueStyle={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}
               titleStyle={{ color: '#1a1a1a', fontSize: '14px', fontWeight: '500' }}
             />
           </Col>
           <Col xs={24} md={8}>
             <Statistic
               title="Social Accounts"
               value={summary.socialAccounts || 0}
               valueStyle={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}
               titleStyle={{ color: '#1a1a1a', fontSize: '14px', fontWeight: '500' }}
               suffix="connected"
             />
           </Col>
        </Row>
        <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
                     <Col xs={24} md={12}>
             <Space>
               <Badge 
                 status={summary.maintenanceMode ? 'error' : 'success'} 
                 text={summary.maintenanceMode ? 'Maintenance Mode ON' : 'Site Active'}
                 style={{ color: '#1a1a1a' }}
               />
               <Badge 
                 status={summary.analyticsEnabled ? 'success' : 'default'} 
                 text={summary.analyticsEnabled ? 'Analytics Enabled' : 'Analytics Disabled'}
                 style={{ color: '#1a1a1a' }}
               />
             </Space>
           </Col>
           <Col xs={24} md={12} style={{ textAlign: 'right' }}>
             <Text style={{ color: '#666', fontSize: '14px' }}>
               Last updated: {summary.lastUpdated ? dayjs(summary.lastUpdated).format('MMM DD, YYYY HH:mm') : 'Never'}
             </Text>
           </Col>
        </Row>
      </Card>

      {/* Action Buttons */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col>
          <Button 
            icon={<ExportOutlined />}
            onClick={() => setExportModalVisible(true)}
            style={buttonStyle}
          >
            Export Settings
          </Button>
        </Col>
        <Col>
          <Button 
            icon={<ImportOutlined />}
            onClick={() => setImportModalVisible(true)}
            style={buttonStyle}
          >
            Import Settings
          </Button>
        </Col>
        <Col>
          <Button 
            icon={<ReloadOutlined />}
            danger
            onClick={() => setResetModalVisible(true)}
            style={dangerButtonStyle}
          >
            Reset Settings
          </Button>
        </Col>
        <Col>
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            style={buttonStyle}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Settings Tabs */}
      <Card style={tabsCardStyle}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ background: '#ffffff' }}
        />
      </Card>

      {/* Import Modal */}
      <Modal
        title="Import Settings"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Upload
            accept=".json"
            fileList={fileList}
            onChange={handleImportUpload}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} size="large">
              Choose Settings File
            </Button>
          </Upload>
          <Text type="secondary" style={{ display: 'block', marginTop: '16px' }}>
            Upload a JSON file containing your site settings
          </Text>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal
        title="Export Settings"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setExportModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="export" 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => exportSettingsMutation.mutate()}
            loading={exportSettingsMutation.isPending}
          >
            Export Settings
          </Button>
        ]}
        width={500}
      >
        <div style={{ padding: '20px' }}>
          <Text>
            This will export all your current site settings to a JSON file that you can use for backup or migration purposes.
          </Text>
        </div>
      </Modal>

      {/* Reset Modal */}
      <Modal
        title="Reset Settings"
        open={resetModalVisible}
        onCancel={() => setResetModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setResetModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="reset" 
            danger
            icon={<ReloadOutlined />}
            onClick={() => resetSettingsMutation.mutate()}
            loading={resetSettingsMutation.isPending}
          >
            Reset All Settings
          </Button>
        ]}
        width={500}
      >
        <div style={{ padding: '20px' }}>
          <Alert
            message="Warning"
            description="This action will reset all settings to their default values. This action cannot be undone."
            type="warning"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Text>
            Are you sure you want to reset all settings to their default values?
          </Text>
        </div>
      </Modal>
    </div>
  );
}

