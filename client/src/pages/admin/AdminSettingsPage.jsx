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
import SimpleImageUpload from '../../components/SimpleImageUpload';

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
                  label="Logo"
                  style={formItemStyle}
                >
                  <SimpleImageUpload
                    onUploadSuccess={(url) => {
                      appearanceForm.setFieldsValue({ logo: url });
                    }}
                    onUploadError={(error) => {
                      message.error('Failed to upload logo: ' + error);
                    }}
                    uploadText="Upload Logo"
                    accept="image/*"
                    maxSize={2 * 1024 * 1024} // 2MB
                    showPreview={true}
                    previewStyle={{ width: '100px', height: '60px', objectFit: 'contain' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="favicon"
                  label="Favicon"
                  style={formItemStyle}
                >
                  <SimpleImageUpload
                    onUploadSuccess={(url) => {
                      appearanceForm.setFieldsValue({ favicon: url });
                    }}
                    onUploadError={(error) => {
                      message.error('Failed to upload favicon: ' + error);
                    }}
                    uploadText="Upload Favicon"
                    accept="image/x-icon,image/png"
                    maxSize={1 * 1024 * 1024} // 1MB
                    showPreview={true}
                    previewStyle={{ width: '32px', height: '32px', objectFit: 'contain' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="heroImage"
              label="Default Hero Image"
              style={formItemStyle}
            >
              <SimpleImageUpload
                onUploadSuccess={(url) => {
                  appearanceForm.setFieldsValue({ heroImage: url });
                }}
                onUploadError={(error) => {
                  message.error('Failed to upload hero image: ' + error);
                }}
                uploadText="Upload Hero Image"
                accept="image/*"
                maxSize={5 * 1024 * 1024} // 5MB
                showPreview={true}
                previewStyle={{ width: '200px', height: '120px', objectFit: 'cover' }}
              />
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

            <Divider style={dividerStyle}>Typography & Styling</Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fontFamily"
                  label="Font Family"
                  style={formItemStyle}
                >
                  <Select placeholder="Select font family" style={selectStyle}>
                    <Option value="Inter, sans-serif">Inter</Option>
                    <Option value="Roboto, sans-serif">Roboto</Option>
                    <Option value="Open Sans, sans-serif">Open Sans</Option>
                    <Option value="Lato, sans-serif">Lato</Option>
                    <Option value="Poppins, sans-serif">Poppins</Option>
                    <Option value="Montserrat, sans-serif">Montserrat</Option>
                    <Option value="Arial, sans-serif">Arial</Option>
                    <Option value="Helvetica, sans-serif">Helvetica</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fontSize"
                  label="Base Font Size"
                  style={formItemStyle}
                >
                  <Select placeholder="Select font size" style={selectStyle}>
                    <Option value="12px">12px</Option>
                    <Option value="14px">14px</Option>
                    <Option value="16px">16px</Option>
                    <Option value="18px">18px</Option>
                    <Option value="20px">20px</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="borderRadius"
                  label="Border Radius"
                  style={formItemStyle}
                >
                  <Select placeholder="Select border radius" style={selectStyle}>
                    <Option value="0px">None (0px)</Option>
                    <Option value="4px">Small (4px)</Option>
                    <Option value="8px">Medium (8px)</Option>
                    <Option value="12px">Large (12px)</Option>
                    <Option value="16px">Extra Large (16px)</Option>
                    <Option value="50%">Rounded (50%)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="boxShadow"
                  label="Box Shadow"
                  style={formItemStyle}
                >
                  <Select placeholder="Select box shadow" style={selectStyle}>
                    <Option value="none">None</Option>
                    <Option value="0 1px 3px rgba(0,0,0,0.1)">Light</Option>
                    <Option value="0 2px 8px rgba(0,0,0,0.1)">Medium</Option>
                    <Option value="0 4px 12px rgba(0,0,0,0.15)">Heavy</Option>
                    <Option value="0 8px 25px rgba(0,0,0,0.2)">Extra Heavy</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider style={dividerStyle}>Live Preview</Divider>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '20px', 
                  borderRadius: '12px',
                  border: '1px solid #e9ecef'
                }}>
                  <Text strong style={{ display: 'block', marginBottom: '16px' }}>Website Preview</Text>
                  <div style={{ 
                    background: '#ffffff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                  }}>
                    <div style={{ 
                      height: '40px', 
                      background: appearanceForm.getFieldValue('primaryColor') || '#000000',
                      borderRadius: '4px',
                      marginBottom: '16px'
                    }}></div>
                    <div style={{ 
                      height: '20px', 
                      background: appearanceForm.getFieldValue('textColor') || '#000000',
                      borderRadius: '4px',
                      marginBottom: '8px',
                      width: '60%'
                    }}></div>
                    <div style={{ 
                      height: '16px', 
                      background: appearanceForm.getFieldValue('textColor') || '#000000',
                      borderRadius: '4px',
                      marginBottom: '16px',
                      width: '40%',
                      opacity: 0.7
                    }}></div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ 
                        height: '32px', 
                        background: appearanceForm.getFieldValue('primaryColor') || '#000000',
                        borderRadius: '4px',
                        width: '80px'
                      }}></div>
                      <div style={{ 
                        height: '32px', 
                        background: appearanceForm.getFieldValue('secondaryColor') || '#ffffff',
                        border: `1px solid ${appearanceForm.getFieldValue('primaryColor') || '#000000'}`,
                        borderRadius: '4px',
                        width: '80px'
                      }}></div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} lg={8}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    icon={<EyeOutlined />}
                    onClick={previewTheme}
                    block
                    style={buttonStyle}
                  >
                    Preview Theme
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={resetTheme}
                    block
                    style={buttonStyle}
                  >
                    Reset to Default
                  </Button>
                </Space>
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
                  name="gstNumber"
                  label="GST Number"
                  style={formItemStyle}
                >
                  <Input placeholder="GST Number" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="insuranceProvider"
                  label="Insurance Provider"
                  style={formItemStyle}
                >
                  <Input placeholder="Insurance Provider Name" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

                <Form.Item
              name="insurancePolicy"
              label="Insurance Policy Number"
                  style={formItemStyle}
                >
              <Input placeholder="Policy Number" style={inputStyle} />
                </Form.Item>

            <Divider style={dividerStyle}>Certifications & Awards</Divider>

                <Form.Item
              name="certifications"
              label="Certifications"
                  style={formItemStyle}
                >
              <Select
                mode="tags"
                placeholder="Add certifications"
                style={selectStyle}
                open={false}
              />
                </Form.Item>

                <Form.Item
              name="awards"
              label="Awards"
                  style={formItemStyle}
                >
              <Select
                mode="tags"
                placeholder="Add awards"
                style={selectStyle}
                open={false}
              />
                </Form.Item>

                <Form.Item
              name="partnerships"
              label="Partnerships"
                  style={formItemStyle}
                >
              <Select
                mode="tags"
                placeholder="Add partnerships"
                style={selectStyle}
                open={false}
              />
                </Form.Item>

            <Divider style={dividerStyle}>Service Areas & Specialties</Divider>

            <Form.Item
              name="serviceAreas"
              label="Service Areas"
              style={formItemStyle}
            >
              <Select
                mode="tags"
                placeholder="Add service areas"
                style={selectStyle}
                open={false}
              />
            </Form.Item>

            <Form.Item
              name="specialties"
              label="Specialties"
              style={formItemStyle}
            >
              <Select
                mode="tags"
                placeholder="Add specialties"
                style={selectStyle}
                open={false}
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
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
            <Form.Item
                  name="blogEnabled"
                  label="Enable Blog"
                  valuePropName="checked"
              style={formItemStyle}
            >
                  <Switch />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="testimonialsEnabled"
                  label="Enable Testimonials"
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
                  name="galleryEnabled"
                  label="Enable Gallery"
                  valuePropName="checked"
              style={formItemStyle}
            >
                  <Switch />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="newsletterEnabled"
                  label="Enable Newsletter"
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
                  name="chatEnabled"
                  label="Enable Chat Widget"
                  valuePropName="checked"
              style={formItemStyle}
            >
                  <Switch />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="defaultLanguage"
                  label="Default Language"
                  style={formItemStyle}
                >
                  <Select placeholder="Select default language" style={selectStyle}>
                    <Option value="en">English</Option>
                    <Option value="es">Spanish</Option>
                    <Option value="fr">French</Option>
                    <Option value="de">German</Option>
                    <Option value="it">Italian</Option>
                    <Option value="pt">Portuguese</Option>
                    <Option value="ru">Russian</Option>
                    <Option value="zh">Chinese</Option>
                    <Option value="ja">Japanese</Option>
                    <Option value="ko">Korean</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="chatWidget"
              label="Chat Widget Code"
              style={formItemStyle}
            >
              <TextArea rows={4} placeholder="Paste your chat widget code here..." style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="supportedLanguages"
              label="Supported Languages"
              style={formItemStyle}
            >
              <Select
                mode="multiple"
                placeholder="Select supported languages"
                style={selectStyle}
              >
                <Option value="en">English</Option>
                <Option value="es">Spanish</Option>
                <Option value="fr">French</Option>
                <Option value="de">German</Option>
                <Option value="it">Italian</Option>
                <Option value="pt">Portuguese</Option>
                <Option value="ru">Russian</Option>
                <Option value="zh">Chinese</Option>
                <Option value="ja">Japanese</Option>
                <Option value="ko">Korean</Option>
              </Select>
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
            <Divider style={dividerStyle}>Google Services</Divider>

            <Form.Item
              name="googleMapsApiKey"
              label="Google Maps API Key"
              style={formItemStyle}
            >
              <Input placeholder="AIzaSyB..." style={inputStyle} />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
            <Form.Item
                  name="recaptchaSiteKey"
                  label="reCAPTCHA Site Key"
              style={formItemStyle}
            >
                  <Input placeholder="6Lc..." style={inputStyle} />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="recaptchaSecretKey"
                  label="reCAPTCHA Secret Key"
                  style={formItemStyle}
                >
                  <Input.Password placeholder="6Lc..." style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={dividerStyle}>Email Marketing</Divider>

            <Form.Item
              name="mailchimpApiKey"
              label="Mailchimp API Key"
              style={formItemStyle}
            >
              <Input.Password placeholder="your-api-key-here" style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="mailchimpListId"
              label="Mailchimp List ID"
              style={formItemStyle}
            >
              <Input placeholder="your-list-id-here" style={inputStyle} />
            </Form.Item>

            <Divider style={dividerStyle}>Payment Processing</Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
            <Form.Item
                  name="stripePublicKey"
                  label="Stripe Public Key"
              style={formItemStyle}
            >
                  <Input placeholder="pk_test_..." style={inputStyle} />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="stripeSecretKey"
                  label="Stripe Secret Key"
                  style={formItemStyle}
                >
                  <Input.Password placeholder="sk_test_..." style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="paypalClientId"
                  label="PayPal Client ID"
                  style={formItemStyle}
                >
                  <Input placeholder="client-id-here" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="paypalSecret"
                  label="PayPal Secret"
                  style={formItemStyle}
                >
                  <Input.Password placeholder="secret-here" style={inputStyle} />
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
            <Divider style={dividerStyle}>SSL & Headers</Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
            <Form.Item
                  name="enableSSL"
                  label="Enable SSL"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="enableHSTS"
                  label="Enable HSTS"
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
                  name="enableCSP"
                  label="Enable Content Security Policy"
                  valuePropName="checked"
              style={formItemStyle}
            >
                  <Switch />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="enableXSSProtection"
                  label="Enable XSS Protection"
                  valuePropName="checked"
                  style={formItemStyle}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="enableCSRFProtection"
              label="Enable CSRF Protection"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Divider style={dividerStyle}>Session & Authentication</Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
            <Form.Item
              name="sessionTimeout"
                  label="Session Timeout (seconds)"
              style={formItemStyle}
            >
              <InputNumber 
                    placeholder="3600" 
                    min={300} 
                    max={86400} 
                style={{ width: '100%' }}
              />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
            <Form.Item
                  name="maxLoginAttempts"
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
              </Col>
            </Row>

            <Form.Item
              name="passwordMinLength"
              label="Minimum Password Length"
              style={formItemStyle}
            >
              <InputNumber 
                placeholder="8" 
                min={6} 
                max={50} 
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
            <Divider style={dividerStyle}>Caching & Optimization</Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
            <Form.Item
                  name="enableCaching"
                  label="Enable Caching"
                  valuePropName="checked"
              style={formItemStyle}
            >
                  <Switch />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
            <Form.Item
                  name="enableCompression"
              label="Enable Compression"
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
                  name="enableMinification"
              label="Enable Minification"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
            <Form.Item
              name="imageOptimization"
              label="Enable Image Optimization"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="lazyLoading"
              label="Enable Lazy Loading"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Divider style={dividerStyle}>CDN Settings</Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="enableCDN"
                  label="Enable CDN"
                  valuePropName="checked"
                  style={formItemStyle}
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="cdnUrl"
                  label="CDN URL"
                  style={formItemStyle}
                >
                  <Input placeholder="https://cdn.example.com" style={inputStyle} />
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
            <Divider style={dividerStyle}>Notification Types</Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
            <Form.Item
              name="emailNotifications"
              label="Enable Email Notifications"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
            <Form.Item
                  name="smsNotifications"
                  label="Enable SMS Notifications"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="pushNotifications"
              label="Enable Push Notifications"
              valuePropName="checked"
              style={formItemStyle}
            >
              <Switch />
            </Form.Item>

            <Divider style={dividerStyle}>Email Addresses</Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
            <Form.Item
                  name="contactFormEmail"
                  label="Contact Form Email"
                  rules={[{ type: 'email', message: 'Please enter valid email' }]}
              style={formItemStyle}
            >
                  <Input placeholder="info@australianengineering.com.au" style={inputStyle} />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="newOrderEmail"
                  label="New Order Email"
                  rules={[{ type: 'email', message: 'Please enter valid email' }]}
                  style={formItemStyle}
                >
                  <Input placeholder="orders@australianengineering.com.au" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="supportEmail"
              label="Support Email"
              rules={[{ type: 'email', message: 'Please enter valid email' }]}
              style={formItemStyle}
            >
              <Input placeholder="support@australianengineering.com.au" style={inputStyle} />
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
      key: 'pages',
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: '8px' }} />
          Page Settings
        </span>
      ),
      children: (
        <Card title="Page-Specific Settings" style={cardStyle}>
          <Tabs
            type="card"
            items={[
              {
                key: 'home',
                label: 'Home Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                  <Form.Item
                          name={['pages', 'home', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="Home - Australian Engineering Solutions" style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'home', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name={['pages', 'home', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="Home page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'home', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="home, engineering, solutions" style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'home', 'customCSS']}
                      label="Custom CSS"
                      style={formItemStyle}
                    >
                      <TextArea rows={4} placeholder="/* Custom CSS for home page */" style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'home', 'customJS']}
                      label="Custom JavaScript"
                      style={formItemStyle}
                    >
                      <TextArea rows={4} placeholder="// Custom JS for home page" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              },
              {
                key: 'about',
                label: 'About Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'about', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="About Us - Australian Engineering Solutions" style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'about', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name={['pages', 'about', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="About page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'about', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="about, company, team" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              },
              {
                key: 'services',
                label: 'Services Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'services', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="Services - Australian Engineering Solutions" style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'services', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name={['pages', 'services', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="Services page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'services', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="services, engineering, modifications" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              },
              {
                key: 'contact',
                label: 'Contact Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'contact', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="Contact Us - Australian Engineering Solutions" style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'contact', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name={['pages', 'contact', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="Contact page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'contact', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="contact, location, phone" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              },
              {
                key: 'projects',
                label: 'Projects Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'projects', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="Projects - Australian Engineering Solutions" style={inputStyle} />
                  </Form.Item>
                </Col>
                      <Col xs={24} md={12}>
                  <Form.Item
                          name={['pages', 'projects', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                  </Form.Item>
                </Col>
                    </Row>
                  <Form.Item
                      name={['pages', 'projects', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="Projects page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'projects', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="projects, portfolio, work" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              },
              {
                key: 'caseStudies',
                label: 'Case Studies Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'caseStudies', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="Case Studies - Australian Engineering Solutions" style={inputStyle} />
                  </Form.Item>
                </Col>
                      <Col xs={24} md={12}>
                  <Form.Item
                          name={['pages', 'caseStudies', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                  </Form.Item>
                </Col>
              </Row>
                    <Form.Item
                      name={['pages', 'caseStudies', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="Case studies page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'caseStudies', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="case studies, examples, success stories" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              },
              {
                key: 'team',
                label: 'Team Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'team', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="Our Team - Australian Engineering Solutions" style={inputStyle} />
                        </Form.Item>
                </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'team', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                        </Form.Item>
                </Col>
                    </Row>
                    <Form.Item
                      name={['pages', 'team', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="Team page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'team', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="team, staff, employees" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              },
              {
                key: 'inspiration',
                label: 'Inspiration Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'inspiration', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="Inspiration Gallery - Australian Engineering Solutions" style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'inspiration', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                        </Form.Item>
                </Col>
              </Row>
                    <Form.Item
                      name={['pages', 'inspiration', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="Inspiration gallery page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'inspiration', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="inspiration, gallery, ideas" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              },
              {
                key: 'blog',
                label: 'Blog Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'blog', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="Blog - Australian Engineering Solutions" style={inputStyle} />
                        </Form.Item>
          </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'blog', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name={['pages', 'blog', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="Blog page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'blog', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="blog, articles, news" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              },
              {
                key: 'privacy',
                label: 'Privacy Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'privacy', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="Privacy Policy - Australian Engineering Solutions" style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'privacy', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                        </Form.Item>
          </Col>
        </Row>
                    <Form.Item
                      name={['pages', 'privacy', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="Privacy policy page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'privacy', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="privacy, policy, legal" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              },
              {
                key: 'terms',
                label: 'Terms Page',
                children: (
                  <Form layout="vertical">
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'terms', 'title']}
                          label="Page Title"
                          style={formItemStyle}
                        >
                          <Input placeholder="Terms of Service - Australian Engineering Solutions" style={inputStyle} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['pages', 'terms', 'isActive']}
                          label="Page Active"
                          valuePropName="checked"
                          style={formItemStyle}
                        >
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name={['pages', 'terms', 'description']}
                      label="Meta Description"
                      style={formItemStyle}
                    >
                      <TextArea rows={3} placeholder="Terms of service page meta description..." style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                      name={['pages', 'terms', 'keywords']}
                      label="Meta Keywords"
                      style={formItemStyle}
                    >
                      <Input placeholder="terms, service, legal" style={inputStyle} />
                    </Form.Item>
                  </Form>
                )
              }
            ]}
          />
          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              icon={<SaveOutlined />}
              style={primaryButtonStyle}
            >
              Save Page Settings
            </Button>
          </div>
        </Card>
      )
    },

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

